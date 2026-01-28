// ============================================
// TypeScript 타입 정의
// ============================================

// Cloudflare Bindings
export type Bindings = {
  DB: D1Database;
  // KV: KVNamespace; // 추후 추가
  R2: R2Bucket; // 파일 스토리지
};

export type Variables = {
  user: JWTPayload;
};

// User 관련 타입
export type UserRole = 'student' | 'teacher' | 'admin';
export type SocialProvider = 'naver' | 'kakao' | 'google' | null;

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  role: UserRole;
  social_provider?: SocialProvider;
  social_id?: string;
  profile_image?: string;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  updated_at: string;
}

// Campus 관련 타입
export interface Campus {
  id: number;
  name: string;
  region: string;
  address?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  description?: string;
  facilities?: string; // JSON
  certifications?: string; // JSON
  images?: string; // JSON
  created_at: string;
  updated_at: string;
}

// Course 관련 타입
export type CourseStatus = 'active' | 'closed' | 'full';

export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  description?: string;
  curriculum?: string; // JSON
  duration_months?: number;
  duration_hours?: number;
  price: number;
  discount_price?: number;
  thumbnail_url?: string;
  detail_images?: string; // JSON
  campus_id?: number;
  teacher_id?: number;
  status: CourseStatus;
  max_students: number;
  current_students: number;
  start_date?: string;
  end_date?: string;
  schedule?: string;
  tags?: string; // JSON
  class_days?: string; // JSON (Selected dates array)
  rating: number;
  review_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Enrollment 관련 타입
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'card' | 'transfer' | 'gov_support';

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: EnrollmentStatus;
  payment_status: PaymentStatus;
  payment_amount?: number;
  payment_method?: PaymentMethod;
  payment_date?: string;
  progress: number;
  attendance: number;
  grade?: string;
  certificate_url?: string;
  enrolled_at: string;
  completed_at?: string;
}

// Review 관련 타입
export interface Review {
  id: number;
  user_id: number;
  course_id: number;
  enrollment_id?: number;
  rating: number; // 1-5
  title?: string;
  content?: string;
  images?: string; // JSON
  approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// Post 관련 타입
export type PostCategory = 'notice' | 'faq' | 'portfolio' | 'qna';
export type PostStatus = 'draft' | 'published' | 'hidden';

export interface Post {
  id: number;
  category: PostCategory;
  title: string;
  content?: string;
  author_id?: number;
  author_name?: string;
  images?: string; // JSON
  views: number;
  likes: number;
  pinned: boolean;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

// Comment 관련 타입
export interface Comment {
  id: number;
  post_id: number;
  user_id?: number;
  user_name?: string;
  content: string;
  parent_id?: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// Consultation 관련 타입
export type ConsultationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';

export interface Consultation {
  id: number;
  user_id?: number;
  name: string;
  phone: string;
  email?: string;
  campus_id?: number;
  course_id?: number;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: ConsultationStatus;
  memo?: string;
  created_at: string;
  updated_at: string;
}

// Bookmark 관련 타입
export interface Bookmark {
  id: number;
  user_id: number;
  course_id: number;
  created_at: string;
}

// API Response 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// JWT Payload 타입
export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Request Body 타입들
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
}

export interface CourseFilter {
  category?: string;
  region?: string;
  campus_id?: number;
  status?: CourseStatus;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: 'latest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface EnrollmentRequest {
  course_id: number;
  payment_method?: PaymentMethod;
}

export interface ReviewRequest {
  course_id: number;
  rating: number;
  title?: string;
  content?: string;
}

export interface ConsultationRequest {
  name: string;
  phone: string;
  email?: string;
  campus_id?: number;
  course_id?: number;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
}
