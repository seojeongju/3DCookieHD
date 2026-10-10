// ============================================
// JWT 유틸리티 (Cloudflare Workers 환경)
// ============================================

import type { JWTPayload } from '../types';

// 서명 키는 요청마다 env.JWT_SECRET 으로 주입된다 (configureJwtSecret). 소스에 키를 두지 않는다.
let JWT_SECRET = '';

const MIN_SECRET_LENGTH = 32;

export function configureJwtSecret(secret: string | undefined): void {
  JWT_SECRET = secret && secret.length >= MIN_SECRET_LENGTH ? secret : '';
}

function requireSecret(): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET 환경 변수가 설정되지 않았거나 너무 짧습니다');
  return JWT_SECRET;
}

/**
 * JWT 토큰 생성
 * Web Crypto API 사용 (Cloudflare Workers 환경)
 */
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24시간 후 만료
  };

  // Base64URL 인코딩
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  // 서명 생성
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, requireSecret());

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * JWT 토큰 검증
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // 서명 검증
    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, requireSecret());
    if (signature !== expectedSignature) {
      return null;
    }

    // Payload 디코딩
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload;

    // 만료 시간 확인
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * HMAC SHA-256 서명 생성
 */
async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return base64UrlEncode(signature);
}

/**
 * Base64URL 인코딩
 */
function base64UrlEncode(data: string | ArrayBuffer): string {
  let bytes: Uint8Array;

  if (typeof data === 'string') {
    const encoder = new TextEncoder();
    bytes = encoder.encode(data);
  } else {
    bytes = new Uint8Array(data);
  }

  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = btoa(binary);

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64URL 디코딩
 */
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

// 형식: pbkdf2_sha256$<반복 횟수>$<salt base64>$<hash base64>
// Workers의 Web Crypto PBKDF2는 반복 횟수 100,000을 넘기면 오류가 난다.
// 무료 플랜 CPU 제한(요청당 10ms) 때문에 낮게 둔다. 값을 올리면 다음 로그인 때 자동으로 재해싱된다
const PBKDF2_PREFIX = 'pbkdf2_sha256';
const PBKDF2_ITERATIONS = 10_000;
const PBKDF2_MAX_ITERATIONS = 100_000;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations }, key, 256);
  return new Uint8Array(bits);
}

async function legacySha256Hex(password: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * 비밀번호 해싱 (사용자별 솔트 + PBKDF2-SHA256)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `${PBKDF2_PREFIX}$${PBKDF2_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

/**
 * 비밀번호 검증 (PBKDF2 형식 + 이전 솔트 없는 SHA-256 형식 모두 지원)
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!hashedPassword) return false;
  const encoder = new TextEncoder();
  if (hashedPassword.startsWith(`${PBKDF2_PREFIX}$`)) {
    const [, iterRaw, saltB64, hashB64] = hashedPassword.split('$');
    const iterations = parseInt(iterRaw, 10);
    if (!Number.isFinite(iterations) || iterations < 1 || iterations > PBKDF2_MAX_ITERATIONS || !saltB64 || !hashB64) return false;
    try {
      const expected = base64ToBytes(hashB64);
      const actual = await pbkdf2(password, base64ToBytes(saltB64), iterations);
      return constantTimeEqual(actual, expected);
    } catch {
      return false;
    }
  }
  const legacy = await legacySha256Hex(password);
  return constantTimeEqual(encoder.encode(legacy), encoder.encode(hashedPassword));
}

/** 이전 형식이거나 반복 횟수가 현재 기준과 다르면 true (로그인 성공 시 재해싱 대상) */
export function passwordNeedsRehash(hashedPassword: string): boolean {
  return !hashedPassword.startsWith(`${PBKDF2_PREFIX}$${PBKDF2_ITERATIONS}$`);
}
