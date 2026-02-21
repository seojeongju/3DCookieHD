// ============================================
// 인증 API
// ============================================

import { Hono } from 'hono';
import type { Bindings, LoginRequest, RegisterRequest, User, JWTPayload } from '../types';
import { successResponse, errorResponse, createdResponse } from '../utils/response';
import { getOne, execute } from '../utils/database';
import { generateToken, hashPassword, verifyPassword } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';

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

    // 6. 가입 전 상담 이력 및 문의글 자동 매칭 (Link former lead data)
    if (phone && userRole === 'student') {
      try {
        // 이전에 이 연락처로 접수된 온라인 문의글이 있다면 user_id 연결
        await c.env.DB.prepare(`
          UPDATE consultations 
          SET user_id = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE phone = ? AND user_id IS NULL
        `).bind(newUser!.id, phone).run();

        // 이전에 이 연락처로 작성된 입학 상담 일지가 있다면 student_id 연결
        // consultation_id가 있는 로그들 중 연락처가 일치하는 것을 찾아 연결
        await c.env.DB.prepare(`
          UPDATE hrd_counseling_logs 
          SET student_id = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE student_id IS NULL AND consultation_id IN (
            SELECT id FROM consultations WHERE phone = ?
          )
        `).bind(newUser!.id, phone).run();

        console.log(`Auto-linked counseling history for new user: ${phone}`);
      } catch (linkError) {
        console.error('Failed to link lead data:', linkError);
      }
    }

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

    // 비밀번호 제외하고 반환 (초기 로그인 여부 포함)
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
auth.get('/me', authMiddleware, async (c) => {
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
auth.put('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');

    if (!user) {
      return errorResponse(c, '인증이 필요합니다', 401);
    }

    const body = await c.req.json();
    const { name, phone, profile_image } = body;

    // 역할 확인: 수강생(student)은 이름, 전화번호 수정 불가
    const userInfo = await getOne<User>(c.env.DB, 'SELECT role FROM users WHERE id = ?', [user.userId]);
    if (userInfo?.role === 'student') {
      // 수강생은 비밀번호 외의 프로필 정보(이름, 전화번호) 수정 차단
      if (name || phone) {
        return errorResponse(c, '수강생은 본인의 정보를 직접 수정할 수 없습니다. 관리자에게 문의하세요.', 403);
      }
    }

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
auth.post('/change-password', authMiddleware, async (c) => {
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

    // 비밀번호 업데이트 및 초기 로그인 플래그 해제
    await execute(
      c.env.DB,
      'UPDATE users SET password = ?, is_initial_login = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, user.userId]
    );

    return successResponse(c, null, '비밀번호가 변경되었습니다');

  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(c, '비밀번호 변경 중 오류가 발생했습니다', 500);
  }
});

// 비밀번호 찾기 (이메일 발송 요청)
auth.post('/forgot-password', async (c: any) => {
  const { email } = await c.req.json();
  const db = c.env.DB;

  try {
    const user = await getOne<any>(db, 'SELECT id, name FROM users WHERE email = ?', [email]);
    if (!user) {
      // 보안을 위해 사용자가 없어도 성공 메시지를 보낼 수도 있지만, 편의를 위해 에러 반환
      return errorResponse(c, '등록되지 않은 이메일입니다', 404);
    }

    // 보안 토큰 생성 (UUID 느낌의 무작위 문자열)
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1시간 후 만료

    // DB에 토큰 저장
    await execute(db, 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?', [token, expires, user.id]);

    // 이메일 발송
    const { sendResetPasswordEmail } = await import('../utils/email');
    const emailSent = await sendResetPasswordEmail(c.env, email, token, user.name);

    if (emailSent) {
      return successResponse(c, null, '비밀번호 재설정 이메일이 발송되었습니다.');
    } else {
      return errorResponse(c, '이메일 발송에 실패했습니다. 관리자에게 문의하세요.', 500);
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return errorResponse(c, '처리 중 오류가 발생했습니다.');
  }
});

// 비밀번호 재설정 (토큰 검증 및 변경)
auth.post('/reset-password', async (c: any) => {
  const { token, new_password } = await c.req.json();
  const db = c.env.DB;

  try {
    // 토큰 유효성 및 만료 확인
    const user = await getOne<any>(db,
      'SELECT id FROM users WHERE reset_token = ? AND reset_expires > datetime("now")',
      [token]
    );

    if (!user) {
      return errorResponse(c, '유효하지 않거나 만료된 토큰입니다.', 400);
    }

    // 새 비밀번호 해싱
    const { hashPassword } = await import('../utils/jwt');
    const hashedPassword = await hashPassword(new_password);

    // 비밀번호 업데이트 및 토큰 초기화
    await execute(db,
      'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL, is_initial_login = 0 WHERE id = ?',
      [hashedPassword, user.id]
    );

    return successResponse(c, null, '비밀번호가 성공적으로 재설정되었습니다. 새로운 비밀번호로 로그인해 주세요.');
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse(c, '비밀번호 재설정 중 오류가 발생했습니다.');
  }
});

export default auth;
