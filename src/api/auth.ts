// ============================================
// 인증 API
// ============================================

import { Hono } from 'hono';
import type { Bindings, LoginRequest, RegisterRequest, User, JWTPayload } from '../types';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { getOne, execute } from '../utils/database';
import { generateToken, hashPassword, verifyPassword } from '../utils/jwt';

const auth = new Hono<{ Bindings: Bindings, Variables: { user: JWTPayload } }>();

/**
 * POST /api/auth/register
 * 회원가입
 */
auth.post('/register', async (c) => {
  try {
    const body: RegisterRequest = await c.req.json();
    const { email, password, name, phone, role } = body;

    // 유효성 검증
    if (!email || !password || !name) {
      return errorResponse(c, '이메일, 비밀번호, 이름은 필수입니다', 400);
    }

    // Role 및 Status 설정
    const allowedRoles = ['student', 'teacher'];
    const userRole = (role && allowedRoles.includes(role)) ? role : 'student';
    const status = userRole === 'teacher' ? 'pending' : 'active';


    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(c, '유효하지 않은 이메일 형식입니다', 400);
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return errorResponse(c, '비밀번호는 최소 6자 이상이어야 합니다', 400);
    }

    // 중복 이메일 확인
    const existingUser = await getOne<User>(
      c.env.DB,
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return errorResponse(c, '이미 사용 중인 이메일입니다', 409);
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const result = await execute(
      c.env.DB,
      `INSERT INTO users (email, password, name, phone, role, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, phone || null, userRole, status]
    );

    if (!result.success) {
      return errorResponse(c, '회원가입에 실패했습니다', 500);
    }

    // 생성된 사용자 조회
    const newUser = await getOne<User>(
      c.env.DB,
      'SELECT id, email, name, phone, role, status, created_at FROM users WHERE id = ?',
      [result.meta.last_row_id]
    );

    // JWT 토큰 생성
    const token = await generateToken({
      userId: newUser!.id,
      email: newUser!.email,
      role: newUser!.role
    });

    return createdResponse(c, {
      user: newUser,
      token
    }, '회원가입이 완료되었습니다');

  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(c, '회원가입 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /api/auth/login
 * 로그인
 */
auth.post('/login', async (c) => {
  try {
    const body: LoginRequest = await c.req.json();
    const { email, password } = body;

    // 유효성 검증
    if (!email || !password) {
      return errorResponse(c, '이메일과 비밀번호를 입력해주세요', 400);
    }

    // 사용자 조회
    const user = await getOne<User>(
      c.env.DB,
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return errorResponse(c, '이메일 또는 비밀번호가 잘못되었습니다', 401);
    }

    // 계정 상태 확인
    if (user.status === 'pending') {
      return errorResponse(c, '관리자 승인 대기 중인 계정입니다.', 403);
    }
    if (user.status === 'suspended') {
      return errorResponse(c, '이용이 정지된 계정입니다. 관리자에게 문의하세요.', 403);
    }

    // 비밀번호 검증
    if (!user.password) {
      return errorResponse(c, '소셜 로그인 사용자는 일반 로그인을 할 수 없습니다', 400);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return errorResponse(c, '이메일 또는 비밀번호가 잘못되었습니다', 401);
    }

    // JWT 토큰 생성
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(c, {
      user: userWithoutPassword,
      token
    }, '로그인 성공');

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(c, '로그인 중 오류가 발생했습니다', 500);
  }
});

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회
 */
auth.get('/me', async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return errorResponse(c, '인증이 필요합니다', 401);
    }

    // 사용자 정보 조회
    const userInfo = await getOne<User>(
      c.env.DB,
      'SELECT id, email, name, phone, role, status, profile_image, created_at, updated_at FROM users WHERE id = ?',
      [user.userId]
    );

    if (!userInfo) {
      return errorResponse(c, '사용자를 찾을 수 없습니다', 404);
    }

    return successResponse(c, userInfo);

  } catch (error) {
    console.error('Get me error:', error);
    return errorResponse(c, '사용자 정보 조회 중 오류가 발생했습니다', 500);
  }
});

/**
 * PUT /api/auth/profile
 * 프로필 수정
 */
auth.put('/profile', async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return errorResponse(c, '인증이 필요합니다', 401);
    }

    const body = await c.req.json();
    const { name, phone, profile_image } = body;

    // 업데이트할 필드 준비
    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (profile_image !== undefined) {
      updates.push('profile_image = ?');
      params.push(profile_image);
    }

    if (updates.length === 0) {
      return errorResponse(c, '수정할 정보가 없습니다', 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(user.userId);

    // 프로필 업데이트
    await execute(
      c.env.DB,
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // 업데이트된 사용자 정보 조회
    const updatedUser = await getOne<User>(
      c.env.DB,
      'SELECT id, email, name, phone, role, profile_image, created_at, updated_at FROM users WHERE id = ?',
      [user.userId]
    );

    return successResponse(c, updatedUser, '프로필이 수정되었습니다');

  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(c, '프로필 수정 중 오류가 발생했습니다', 500);
  }
});

/**
 * POST /api/auth/change-password
 * 비밀번호 변경
 */
auth.post('/change-password', async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return errorResponse(c, '인증이 필요합니다', 401);
    }

    const body = await c.req.json();
    const { current_password, new_password } = body;

    // 유효성 검증
    if (!current_password || !new_password) {
      return errorResponse(c, '현재 비밀번호와 새 비밀번호를 입력해주세요', 400);
    }

    if (new_password.length < 6) {
      return errorResponse(c, '새 비밀번호는 최소 6자 이상이어야 합니다', 400);
    }

    // 현재 사용자 정보 조회
    const userInfo = await getOne<User>(
      c.env.DB,
      'SELECT * FROM users WHERE id = ?',
      [user.userId]
    );

    if (!userInfo || !userInfo.password) {
      return errorResponse(c, '비밀번호를 변경할 수 없습니다', 400);
    }

    // 현재 비밀번호 검증
    const isValid = await verifyPassword(current_password, userInfo.password);
    if (!isValid) {
      return errorResponse(c, '현재 비밀번호가 일치하지 않습니다', 401);
    }

    // 새 비밀번호 해싱
    const hashedPassword = await hashPassword(new_password);

    // 비밀번호 업데이트
    await execute(
      c.env.DB,
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, user.userId]
    );

    return successResponse(c, null, '비밀번호가 변경되었습니다');

  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(c, '비밀번호 변경 중 오류가 발생했습니다', 500);
  }
});

export default auth;
