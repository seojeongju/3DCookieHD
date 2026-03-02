import { Hono } from 'hono';
import { Bindings, JWTPayload, Variables } from '../types';
import { successResponse, errorResponse, forbiddenResponse } from '../utils/response';
import { authMiddleware } from '../middleware/auth';
import { resolveSessionToLmsCourseId } from '../utils/sessionCourseResolution';
import { calcActualDailyMinutes, calcAttendedMinutes } from '../lib/attendance';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

function timeToMinutesSinceMidnight(s: string | null | undefined): number | null {
    if (!s || typeof s !== 'string') return null;
    const parts = String(s).trim().substring(0, 8).split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || '0', 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
}

function attendanceDurationMinutes(checkIn: string | null | undefined, checkOut: string | null | undefined): number {
    const inM = timeToMinutesSinceMidnight(checkIn);
    const outM = timeToMinutesSinceMidnight(checkOut);
    if (inM == null || outM == null) return 0;
    let diff = outM - inM;
    if (diff <= 0) diff += 24 * 60;
    return diff;
}

/** DB CHECK allows only '', 'card', 'transfer', 'cash'. Normalize to avoid SQLITE_CONSTRAINT. */
function normalizePaymentMethod(v: string | null | undefined): string | null {
    if (v == null || typeof v !== 'string') return null;
    const s = String(v).trim().toLowerCase();
    if (['', 'card', 'transfer', 'cash'].includes(s)) return s === '' ? null : s;
    return null;
}

/** 지원유형: DB CHECK allows only '', 'jobholder', 'unemployed', 'package2', 'package1', 'eitc', 'general'. */
function normalizePackageType(v: string | null | undefined): string | null {
    if (v == null || typeof v !== 'string') return null;
    const s = String(v).trim().toLowerCase();
    if (['', 'jobholder', 'unemployed', 'package2', 'package1', 'eitc', 'general'].includes(s)) return s === '' ? null : s;
    return null;
}

// 회차/과정 ID → LMS 과정 ID (과제·훈련일지·시험 등과 동일 로직: 풀네임·1:1)
async function resolveLmsCourseId(DB: any, id: any): Promise<number | null> {
    return resolveSessionToLmsCourseId(DB, id);
}

// ============================================
// 교강사 관리 API
// ============================================

// 교강사 목록 조회 (교강사 정보 + 유저명/사진 등)
app.get('/personnel', async (c) => {
    try {
        const jsonFields = ['education', 'career', 'certifications', 'training_history', 'teaching_history'];
        const existingColumns: string[] = [];

        for (const col of jsonFields) {
            try {
                await c.env.DB.prepare(`SELECT ${col} FROM hrd_instructors LIMIT 1`).first();
                existingColumns.push(col);
            } catch (e) {
                try {
                    await c.env.DB.prepare(`ALTER TABLE hrd_instructors ADD COLUMN ${col} TEXT`).run();
                    existingColumns.push(col);
                } catch (alterError) {
                    console.warn(`Failed to add column ${col}:`, alterError);
                }
            }
        }

        const selectFields = [
            'u.id', 'u.name', 'u.email', 'u.phone', 'u.role', 'u.status as user_status', 'u.profile_image',
            'i.position', 'i.subject', 'i.type', 'i.status as instructor_status', 'i.joined_at', 'u.created_at'
        ];

        for (const col of existingColumns) {
            selectFields.push(`i.${col}`);
        }

        const query = `
            SELECT ${selectFields.join(', ')}
            FROM users u
            LEFT JOIN hrd_instructors i ON u.id = i.user_id
            WHERE u.role = 'teacher' OR i.user_id IS NOT NULL
            ORDER BY u.created_at DESC
        `;

        const { results } = await c.env.DB.prepare(query).all();

        const processedResults = (results || []).map((row: any) => {
            const processed: any = { ...row };
            for (const field of jsonFields) {
                if (processed[field] !== null && processed[field] !== undefined) {
                    try {
                        if (typeof processed[field] === 'string') {
                            const trimmed = processed[field].trim();
                            if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === '[]') {
                                processed[field] = null;
                            } else {
                                processed[field] = JSON.parse(trimmed);
                            }
                        }
                    } catch (e) {
                        processed[field] = null;
                    }
                } else {
                    processed[field] = null;
                }
            }
            return processed;
        });

        // R2에 없는 profile_image는 null로 내려서 프론트 404 방지
        const R2 = c.env.R2;
        if (R2 && processedResults.length > 0) {
            const withValidProfile = await Promise.all(
                processedResults.map(async (p: any) => {
                    const url = p.profile_image;
                    if (!url || typeof url !== 'string' || !url.includes('/api/upload/files/')) return p;
                    const path = url.replace(/^.*\/api\/upload\/files\//, '').split('?')[0];
                    if (!path) return p;
                    try {
                        const obj = await R2.head(path);
                        if (!obj) return { ...p, profile_image: null };
                        return p;
                    } catch (_) {
                        return { ...p, profile_image: null };
                    }
                })
            );
            return c.json({ success: true, data: withValidProfile });
        }

        return c.json({ success: true, data: processedResults });
    } catch (e) {
        console.error('Failed to fetch personnel:', e);
        return c.json({ success: false, error: '교강사 목록 조회 실패' }, 500);
    }
});

// 교강사 등록
app.post('/personnel', async (c) => {
    try {
        const body = await c.req.json();
        const { email, name, phone, position, subject, type, joined_at, profile_image,
            education, career, certifications, training_history, teaching_history } = body;

        let user: any = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        let userId: number;

        if (!user) {
            const result = await c.env.DB.prepare(
                "INSERT INTO users (email, password, name, phone, role, status, profile_image) VALUES (?, ?, ?, ?, 'teacher', 'active', ?)"
            ).bind(email, 'temp_password', name, phone, profile_image || null).run();
            userId = result.meta.last_row_id as number;
        } else {
            userId = user.id;
            await c.env.DB.prepare("UPDATE users SET role = 'teacher', profile_image = ? WHERE id = ?")
                .bind(profile_image || null, userId).run();
        }

        const processJson = (val: any) => (val && typeof val !== 'string') ? JSON.stringify(val) : (val || null);

        await c.env.DB.prepare(`
            INSERT OR REPLACE INTO hrd_instructors 
            (user_id, position, subject, type, status, joined_at, education, career, certifications, training_history, teaching_history)
            VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)
        `).bind(
            userId, position, subject, type, joined_at,
            processJson(education), processJson(career), processJson(certifications),
            processJson(training_history), processJson(teaching_history)
        ).run();

        return c.json({ success: true, message: '교강사가 등록되었습니다.' });
    } catch (e) {
        console.error('Failed to register personnel:', e);
        return c.json({ success: false, error: '교강사 등록 실패' }, 500);
    }
});

// 교강사 정보 수정
app.put('/personnel/:id', authMiddleware, async (c) => {
    try {
        const rawId = c.req.param('id');
        const userId = parseInt(rawId.includes(':') ? rawId.split(':')[0] : rawId);
        const user = c.get('user');
        const body = await c.req.json();

        if (user.role === 'teacher' && user.userId !== userId) {
            return forbiddenResponse(c, '본인의 정보만 수정할 수 있습니다.');
        }

        const { name, phone, email, position, subject, type, joined_at, instructor_status, profile_image,
            education, career, certifications, training_history, teaching_history } = body;

        // 1. users 테이블 업데이트
        await c.env.DB.prepare(
            "UPDATE users SET name = ?, phone = ?, email = ?, profile_image = ? WHERE id = ?"
        ).bind(name, phone, email, profile_image || null, userId).run();

        // 2. hrd_instructors 테이블 업데이트
        const jsonFields = ['education', 'career', 'certifications', 'training_history', 'teaching_history'];
        for (const col of jsonFields) {
            try {
                await c.env.DB.prepare(`SELECT ${col} FROM hrd_instructors LIMIT 1`).first();
            } catch (e) {
                try {
                    await c.env.DB.prepare(`ALTER TABLE hrd_instructors ADD COLUMN ${col} TEXT`).run();
                } catch (alterError) { }
            }
        }

        const processJson = (val: any) => {
            if (val === null || val === undefined) return null;
            if (typeof val === 'string') {
                const trimmed = val.trim();
                return (trimmed === '' || trimmed === '[]' || trimmed === 'null' || trimmed === 'undefined') ? null : trimmed;
            }
            return JSON.stringify(val);
        };

        const updateFields = ['position = ?', 'subject = ?', 'type = ?', 'joined_at = ?', 'status = ?'];
        const params: any[] = [position, subject, type, joined_at, instructor_status || 'active'];

        const jsonValues = {
            education: processJson(education),
            career: processJson(career),
            certifications: processJson(certifications),
            training_history: processJson(training_history),
            teaching_history: processJson(teaching_history)
        };

        for (const [field, value] of Object.entries(jsonValues)) {
            updateFields.push(`${field} = ?`);
            params.push(value);
        }

        const query = `UPDATE hrd_instructors SET ${updateFields.join(', ')} WHERE user_id = ?`;
        params.push(userId);

        await c.env.DB.prepare(query).bind(...params).run();

        return c.json({ success: true, message: '정보가 수정되었습니다.' });
    } catch (e) {
        console.error('Failed to update personnel:', e);
        return c.json({ success: false, error: '수정 실패: ' + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});

// 교강사 삭제 (퇴직 처리)
app.delete('/personnel/:id', async (c) => {
    try {
        const userId = c.req.param('id');
        // soft delete: hrd_instructors.status = 'retired'
        await c.env.DB.prepare("UPDATE hrd_instructors SET status = 'retired' WHERE user_id = ?").bind(userId).run();
        return c.json({ success: true, message: '퇴직(삭제) 처리되었습니다.' });
    } catch (e) {
        console.error('Failed to delete personnel:', e);
        return c.json({ success: false, error: '삭제 실패' }, 500);
    }
});

// 교강사 승인 (가입 대기 -> 승인)
app.put('/personnel/:id/approve', async (c) => {
    try {
        const id = c.req.param('id');

        // 1. 사용자 상태 active로 변경
        await c.env.DB.prepare("UPDATE users SET status = 'active' WHERE id = ?").bind(id).run();

        // 2. hrd_instructors가 없으면 기본 레코드 생성
        const instructor = await c.env.DB.prepare("SELECT id FROM hrd_instructors WHERE user_id = ?").bind(id).first();
        if (!instructor) {
            await c.env.DB.prepare(`
                INSERT INTO hrd_instructors (user_id, status, type)
                VALUES (?, 'active', 'part')
            `).bind(id).run();
        }

        return c.json({ success: true, message: '승인되었습니다.' });
    } catch (e) {
        console.error('Failed to approve teacher:', e);
        return c.json({ success: false, error: '승인 처리 실패' }, 500);
    }
});

// 교강사 승인 거절 (가입 대기 -> 이용 정지)
app.put('/personnel/:id/reject', async (c) => {
    try {
        const id = c.req.param('id');
        // 사용자 상태 suspended로 변경
        await c.env.DB.prepare("UPDATE users SET status = 'suspended' WHERE id = ?").bind(id).run();
        return c.json({ success: true, message: '승인 거절(정지) 처리되었습니다.' });
    } catch (e) {
        console.error('Failed to reject teacher:', e);
        return c.json({ success: false, error: '거절 처리 실패' }, 500);
    }
});

// ============================================
// 물품 관리 API
// ============================================

// 물품 목록 조회
app.get('/items', async (c) => {
    try {
        const category = c.req.query('category');
        const search = c.req.query('search');
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '10');
        const offset = (page - 1) * limit;

        let whereClause = "WHERE 1=1";
        const params: any[] = [];

        if (category && category !== 'all') {
            whereClause += " AND category = ?";
            params.push(category);
        }

        if (search) {
            whereClause += " AND (name LIKE ? OR model LIKE ? OR location LIKE ?)";
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        // Total count
        const countRes = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM hrd_items ${whereClause}`).bind(...params).first();
        const total = countRes ? countRes.total : 0;

        // Data
        const query = `SELECT * FROM hrd_items ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        const { results } = await c.env.DB.prepare(query).bind(...params, limit, offset).all();

        return c.json({ success: true, data: results, total, page, limit });
    } catch (e) {
        console.error('Failed to fetch items:', e);
        return c.json({ success: false, error: '물품 목록 조회 실패' }, 500);
    }
});

// 전체 입/출고 이력 조회 (Items List보다 뒤, Item Detail보다 앞)
app.get('/items/transactions/all', async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '20');
        const offset = (page - 1) * limit;
        const search = c.req.query('search') || '';
        const type = c.req.query('type'); // 'IN' | 'OUT' | 'all'
        const category = c.req.query('category');

        // History 테이블 존재 여부 체크 (없으면 빈 배열 반환)
        try {
            await c.env.DB.prepare("SELECT id FROM hrd_item_history LIMIT 1").first();
        } catch (e) {
            return c.json({ success: true, data: [], total: 0 });
        }

        let whereClause = "WHERE 1=1";
        const params: any[] = [];

        if (search) {
            whereClause += " AND (i.name LIKE ? OR i.model LIKE ?)";
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        if (type && type !== 'all') {
            whereClause += " AND h.type = ?";
            params.push(type);
        }

        if (category && category !== 'all') {
            whereClause += " AND i.category = ?";
            params.push(category);
        }

        // 전체 카운트
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM hrd_item_history h
            JOIN hrd_items i ON h.item_id = i.id
            ${whereClause}
        `;

        const countRes: any = await c.env.DB.prepare(countQuery).bind(...params).first();
        const total = countRes ? countRes.total : 0;

        // 데이터 조회
        const query = `
            SELECT h.*, i.name as item_name, i.model as item_model, i.category, i.image_url
            FROM hrd_item_history h
            JOIN hrd_items i ON h.item_id = i.id
            ${whereClause}
            ORDER BY h.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const { results } = await c.env.DB.prepare(query).bind(...params, limit, offset).all();

        return c.json({ success: true, data: results, total, page, limit });

    } catch (e) {
        console.error('Failed to fetch all transactions:', e);
        return c.json({ success: false, error: '전체 이력 조회 실패' }, 500);
    }
});

// 물품 상세 조회
app.get('/items/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const item = await c.env.DB.prepare('SELECT * FROM hrd_items WHERE id = ?').bind(id).first();
        if (!item) return c.json({ success: false, error: '물품을 찾을 수 없습니다.' }, 404);
        return c.json({ success: true, data: item });
    } catch (e: any) {
        return c.json({ success: false, error: '물품 상세 조회 실패' }, 500);
    }
});

// 물품 등록
app.post('/items', async (c) => {
    try {
        const body = await c.req.json();
        const { category, name, model, quantity, location, status, memo, image_url } = body;
        const qty = Number(quantity) || 0;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_items (category, name, model, quantity, location, status, memo, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(category, name, model, qty, location, status || 'good', memo, image_url || null).run();

        const newItemId = result.meta.last_row_id;

        // Automatically add to facility items if location matches a facility name
        if (location) {
            const facility: any = await c.env.DB.prepare("SELECT id FROM hrd_facilities WHERE name = ?").bind(location).first();
            if (facility) {
                await c.env.DB.prepare("INSERT INTO hrd_facility_items (facility_id, item_id, quantity) VALUES (?, ?, ?)")
                    .bind(facility.id, newItemId, qty).run();
            }
        }

        return c.json({ success: true, data: { id: newItemId } });
    } catch (e) {
        console.error('Failed to create item:', e);
        return c.json({ success: false, error: '물품 등록 실패' }, 500);
    }
});

// 물품 수정
app.put('/items/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { category, name, model, quantity, location, status, memo, image_url } = body;
        const qty = Number(quantity) || 0;

        await c.env.DB.prepare(`
            UPDATE hrd_items 
            SET category = ?, name = ?, model = ?, quantity = ?, location = ?, status = ?, memo = ?, image_url = ?
            WHERE id = ?
        `).bind(category, name, model, qty, location, status, memo, image_url || null, id).run();

        // Update facility items mapping
        // 1. Remove existing mapping for this item
        await c.env.DB.prepare("DELETE FROM hrd_facility_items WHERE item_id = ?").bind(id).run();

        // 2. Add new mapping if location matches a facility name
        if (location) {
            const facility: any = await c.env.DB.prepare("SELECT id FROM hrd_facilities WHERE name = ?").bind(location).first();
            if (facility) {
                await c.env.DB.prepare("INSERT INTO hrd_facility_items (facility_id, item_id, quantity) VALUES (?, ?, ?)")
                    .bind(facility.id, id, qty).run();
            }
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update item:', e);
        return c.json({ success: false, error: '물품 수정 실패' }, 500);
    }
});

// 대여 등록
app.post('/items/:id/rent', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { user_name, phone, memo } = body;

        await c.env.DB.prepare(`
            INSERT INTO hrd_item_rentals (item_id, user_name, phone, memo, status)
            VALUES (?, ?, ?, ?, 'rented')
        `).bind(id, user_name, phone, memo).run();

        return c.json({ success: true });
    } catch (e) {
        console.error(e);
        return c.json({ success: false, error: '대여 처리 실패' }, 500);
    }
});

// 반납 처리
app.put('/rentals/:id/return', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare(`
            UPDATE hrd_item_rentals SET status = 'returned', returned_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error(e);
        return c.json({ success: false, error: '반납 처리 실패' }, 500);
    }
});

// 대여 이력 조회
app.get('/items/:id/rentals', async (c) => {
    try {
        const id = c.req.param('id');
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_item_rentals WHERE item_id = ? ORDER BY rented_at DESC
        `).bind(id).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        return c.json({ success: false, error: '이력 조회 실패' }, 500);
    }
});

// 특정 물품이 배정된 시설 목록
app.get('/items/:id/facilities', async (c) => {
    try {
        const itemId = c.req.param('id');

        const { results } = await c.env.DB.prepare(`
            SELECT 
                f.id, f.name, f.status, f.manager_main,
                fi.quantity, fi.assigned_at
            FROM hrd_facility_items fi
            JOIN hrd_facilities f ON fi.facility_id = f.id
            WHERE fi.item_id = ?
            ORDER BY f.name
        `).bind(itemId).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        return c.json({ success: false, error: '시설 목록 조회 실패' }, 500);
    }
});

// 물품 입/출고 처리 (재고 변동)
app.post('/items/:id/transaction', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { type, quantity, reason, created_by } = body; // type: 'IN' | 'OUT'
        const qty = Number(quantity);

        if (isNaN(qty) || qty <= 0) {
            return c.json({ success: false, error: '유효하지 않은 수량입니다.' }, 400);
        }

        // 1. History 테이블 존재 확인 및 생성
        try {
            await c.env.DB.prepare("SELECT id FROM hrd_item_history LIMIT 1").first();
        } catch (e) {
            await c.env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS hrd_item_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    prev_quantity INTEGER,
                    new_quantity INTEGER,
                    reason TEXT,
                    created_by TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `).run();
        }

        // 2. 현재 재고 조회
        const item: any = await c.env.DB.prepare("SELECT quantity FROM hrd_items WHERE id = ?").bind(id).first();
        if (!item) return c.json({ success: false, error: '물품을 찾을 수 없습니다.' }, 404);

        const currentQty = item.quantity || 0;
        let newQty = currentQty;

        if (type === 'IN') {
            newQty = currentQty + qty;
        } else if (type === 'OUT') {
            newQty = currentQty - qty;
            if (newQty < 0) {
                return c.json({ success: false, error: '재고가 부족합니다.' }, 400);
            }
        } else {
            return c.json({ success: false, error: '잘못된 구분입니다. (IN/OUT)' }, 400);
        }

        // 3. 트랜잭션 처리 (재고 업데이트 + 이력 기록)
        // D1은 트랜잭션을 배치로 처리
        const batch = [
            c.env.DB.prepare("UPDATE hrd_items SET quantity = ? WHERE id = ?").bind(newQty, id),
            c.env.DB.prepare(`
                INSERT INTO hrd_item_history (item_id, type, quantity, prev_quantity, new_quantity, reason, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).bind(id, type, qty, currentQty, newQty, reason || '', created_by || 'system')
        ];

        // 추가: 시설과 연결된 비품인 경우 hrd_facility_items 수량도 함께 업데이트
        // (단, 1개 시설에만 연결되어 있다고 가정하거나, 가장 최근 연결된 시설만 업데이트 하는 등의 제약이 있을 수 있음.
        //  현재 로직상 hrd_items의 location이 시설명과 일치하면 자동으로 매핑됨.
        //  여기서는 단순화를 위해 hrd_items 수량만 메인으로 관리하고, 
        //  hrd_facility_items는 hrd_items.location에 따라 업데이트/동기화가 필요할 수 있으나,
        //  기존 put /items/:id 로직을 참고하여 location 기반 자동 동기화를 신뢰하거나,
        //  여기서도 명시적으로 업데이트 할 수 있음. 
        //  일단 hrd_items 메인 재고를 기준으로 함.)

        // 시설 아이템 매핑 업데이트 (옵션)
        // const itemInfo = await c.env.DB.prepare("SELECT location FROM hrd_items WHERE id = ?").bind(id).first();
        // if (itemInfo && itemInfo.location) {
        //    batch.push(c.env.DB.prepare("UPDATE hrd_facility_items SET quantity = ? WHERE item_id = ?").bind(newQty, id));
        // }

        await c.env.DB.batch(batch);

        return c.json({ success: true, new_quantity: newQty });
    } catch (e) {
        console.error('Stock transaction failed:', e);
        return c.json({ success: false, error: '입출고 처리 실패' }, 500);
    }
});

// 물품 입/출고 이력 조회
app.get('/items/:id/transaction', async (c) => {
    try {
        const id = c.req.param('id');

        // 테이블 존재 여부 체크 (없으면 빈 배열 반환)
        try {
            await c.env.DB.prepare("SELECT id FROM hrd_item_history LIMIT 1").first();
        } catch (e) {
            return c.json({ success: true, data: [] });
        }

        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_item_history WHERE item_id = ? ORDER BY created_at DESC
        `).bind(id).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error(e);
        return c.json({ success: false, error: '이력 조회 실패' }, 500);
    }
});

// 물품 삭제
app.delete('/items/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM hrd_items WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete item:', e);
        return c.json({ success: false, error: '물품 삭제 실패' }, 500);
    }
});

// ============================================
// 훈련생 관리 API
// ============================================

// 훈련생 목록 조회 (페이지네이션 지원)
app.get('/students', async (c) => {
    try {
        const search = (c.req.query('search') || '').trim();
        const status = c.req.query('status');
        const type = c.req.query('type');
        const sort = ['created_asc', 'name_asc'].includes(c.req.query('sort') || '') ? c.req.query('sort') : 'created_desc';
        const page = Math.max(1, parseInt(c.req.query('page') || '1', 10));
        const limit = Math.min(50, Math.max(10, parseInt(c.req.query('limit') || '15', 10)));
        const offset = (page - 1) * limit;

        const whereClause: string[] = ["u.role = 'student'"];
        const params: any[] = [];

        if (search) {
            whereClause.push("(u.name LIKE ? OR u.phone LIKE ? OR EXISTS (SELECT 1 FROM course_session_enrollments cse JOIN course_sessions cs ON cse.session_id = cs.id JOIN approved_courses a ON cs.approved_course_id = a.id WHERE cse.user_id = u.id AND cse.status IN ('enrolled','approved') AND a.name LIKE ?))");
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }
        if (status) {
            whereClause.push("d.status = ?");
            params.push(status);
        }
        if (type) {
            whereClause.push("d.type = ?");
            params.push(type);
        }

        const whereSql = ' WHERE ' + whereClause.join(' AND ');
        const orderSql = sort === 'name_asc' ? ' ORDER BY u.name ASC, u.id ASC' : sort === 'created_asc' ? ' ORDER BY u.created_at ASC, u.id ASC' : ' ORDER BY u.created_at DESC, u.id DESC';

        // 총 개수 조회
        const countQuery = `SELECT COUNT(*) as total FROM users u LEFT JOIN hrd_student_details d ON u.id = d.user_id ${whereSql}`;
        const countRow = await (params.length > 0
            ? c.env.DB.prepare(countQuery).bind(...params).first()
            : c.env.DB.prepare(countQuery).first()) as { total: number };
        const total = countRow?.total ?? 0;

        const dataQuery = `
            SELECT 
                u.id, u.name, u.phone, u.email, u.created_at,
                u.address, u.birthdate, u.gender, u.education, u.certifications, u.profile_image,
                d.course_id, d.status, d.type, d.last_consult,
                d.package_type, d.payment_method, d.payment_method_note, d.payment_date, d.self_pay_amount,
                d.has_application, d.has_card, d.is_hrd_net_registered, d.status_memo,
                (SELECT (a.name || ' (' || cs.session_number || '회차' || CASE WHEN cs.session_name IS NOT NULL AND TRIM(cs.session_name) <> '' THEN ' - ' || cs.session_name ELSE '' END || ')')
                 FROM course_session_enrollments cse
                 JOIN course_sessions cs ON cse.session_id = cs.id
                 JOIN approved_courses a ON cs.approved_course_id = a.id
                 WHERE cse.user_id = u.id
                 ORDER BY cs.training_start_date DESC LIMIT 1) as current_course_name
            FROM users u
            LEFT JOIN hrd_student_details d ON u.id = d.user_id
            ${whereSql}
            ${orderSql}
            LIMIT ? OFFSET ?
        `;
        const dataParams = [...params, limit, offset];
        const { results } = await c.env.DB.prepare(dataQuery).bind(...dataParams).all();

        const rawList = results || [];
        const userIds = rawList.map((r: any) => r.id).filter(Boolean);
        const currentCoursesByUser: Record<number, { name: string; session_number: number; session_name: string | null; session_status: string }[]> = {};

        if (userIds.length > 0) {
            const placeholders = userIds.map(() => '?').join(',');
            const coursesQuery = `
                SELECT cse.user_id, ac.name as course_name, cs.session_number, cs.session_name, cs.status as session_status
                FROM course_session_enrollments cse
                JOIN course_sessions cs ON cse.session_id = cs.id
                JOIN approved_courses ac ON cs.approved_course_id = ac.id
                WHERE cse.user_id IN (${placeholders}) AND cse.status IN ('enrolled', 'approved')
                ORDER BY cse.user_id, cs.training_start_date DESC
            `;
            const { results: courseRows } = await c.env.DB.prepare(coursesQuery).bind(...userIds).all() as { results: any[] };
            (courseRows || []).forEach((row: any) => {
                const uid = row.user_id;
                if (!currentCoursesByUser[uid]) currentCoursesByUser[uid] = [];
                currentCoursesByUser[uid].push({
                    name: row.course_name,
                    session_number: row.session_number,
                    session_name: row.session_name || null,
                    session_status: row.session_status || null
                });
            });
        }

        const safeResults = rawList.map((r: any) => ({
            ...r,
            course_id: r.course_id || null,
            current_course_name: r.current_course_name || null,
            current_courses: currentCoursesByUser[r.id] || [],
            status: r.status || 'consulting',
            type: r.type || 'jobseeker',
            last_consult: r.last_consult || null,
            has_application: !!r.has_application,
            has_card: !!r.has_card,
            is_hrd_net_registered: !!r.is_hrd_net_registered
        }));

        const totalPages = Math.ceil(total / limit);
        return c.json({
            success: true,
            data: safeResults,
            pagination: { total, page, limit, totalPages }
        });

    } catch (e: any) {
        console.error('Failed to fetch students:', e);
        // 이제는 진짜 서버 에러(500)를 반환해도 됨 (원인을 다 잡았으므로)
        return c.json({ success: false, error: e.message }, 500);
    }
});

// 훈련생 단건 조회 (여정관리 페이지용) — 배정 과정명·상담횟수·출석률 포함
app.get('/students/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const query = `
            SELECT 
                u.id, u.name, u.phone, u.email, u.created_at,
                u.address, u.birthdate, u.gender, u.education, u.certifications, u.profile_image,
                d.course_id, d.status, d.type, d.last_consult,
                d.package_type, d.payment_method, d.payment_method_note, d.payment_date, d.self_pay_amount,
                d.has_application, d.has_card, d.is_hrd_net_registered, d.status_memo,
                (SELECT (a.name || ' (' || cs.session_number || '회차' || CASE WHEN cs.session_name IS NOT NULL AND TRIM(cs.session_name) <> '' THEN ' - ' || cs.session_name ELSE '' END || ')')
                 FROM course_session_enrollments cse
                 JOIN course_sessions cs ON cse.session_id = cs.id
                 JOIN approved_courses a ON cs.approved_course_id = a.id
                 WHERE cse.user_id = u.id
                 ORDER BY cs.training_start_date DESC LIMIT 1) as current_course_name
            FROM users u
            LEFT JOIN hrd_student_details d ON u.id = d.user_id
            WHERE u.role = 'student' AND u.id = ?
        `;
        const row = await c.env.DB.prepare(query).bind(id).first() as any;
        if (!row) return c.json({ success: false, error: '훈련생을 찾을 수 없습니다.' }, 404);
        let r = row;

        const today = new Date().toISOString().split('T')[0];
        const enrolledSessions = await c.env.DB.prepare(`
            SELECT cs.training_end_date
            FROM course_session_enrollments cse
            JOIN course_sessions cs ON cse.session_id = cs.id
            WHERE cse.user_id = ? AND cse.status IN ('enrolled', 'approved')
            ORDER BY cs.training_end_date DESC
        `).bind(id).all() as { results: { training_end_date: string | null }[] };
        const latestActive = enrolledSessions?.results?.[0];
        const endDate = latestActive?.training_end_date;

        // 여정 자동화 1: 수료 완료 상태여도 신규 과정(enrolled/approved)이 아직 종료 전이면 집중훈련(learning)으로 표시
        const hasOngoingEnrollment = endDate != null && endDate > today;
        if (hasOngoingEnrollment) {
            const journeyStatus = r.status || 'consulting';
            if (journeyStatus === 'completed' || journeyStatus === 'learning') {
                await c.env.DB.prepare(
                    `UPDATE hrd_student_details SET status = 'learning' WHERE user_id = ?`
                ).bind(id).run();
                r = { ...r, status: 'learning' };
            }
        } else {
            // 여정 자동화 2: 수강중(learning)인데 enrolled 회차가 모두 종료되었으면 수료완료로 전환
            const journeyStatus = r.status || 'consulting';
            if (journeyStatus === 'learning' && endDate != null && endDate <= today) {
                await c.env.DB.prepare(
                    `UPDATE hrd_student_details SET status = 'completed' WHERE user_id = ?`
                ).bind(id).run();
                r = { ...r, status: 'completed' };
            }
        }

        // 상담 횟수 (hrd_counseling_logs에서 student_id = user_id)
        const consultRow = await c.env.DB.prepare(
            'SELECT COUNT(*) as cnt FROM hrd_counseling_logs WHERE student_id = ?'
        ).bind(id).first() as { cnt: number };
        const consultation_count = consultRow?.cnt ?? 0;

        // 출석 정보 고도화 계산 (현재 수강중인 최신 회차 기준)
        const activeCourseInfo = await c.env.DB.prepare(`
            SELECT 
                cs.id as session_id,
                cs.status as session_status,
                cs.training_time_start,
                cs.training_time_end,
                ac.total_days,
                ac.total_hours,
                ac.daily_hours
            FROM course_session_enrollments cse
            JOIN course_sessions cs ON cse.session_id = cs.id
            JOIN approved_courses ac ON cs.approved_course_id = ac.id
            WHERE cse.user_id = ?
            ORDER BY cs.training_start_date DESC LIMIT 1
        `).bind(id).first() as { session_id: number; session_status: string; training_time_start: string; training_time_end: string; total_days: number; total_hours: number; daily_hours: number } | undefined;

        let attendance_rate = 0;
        let advanced_attendance = null;

        if (activeCourseInfo) {
            const { session_id, session_status, training_time_start, training_time_end, total_days, total_hours, daily_hours } = activeCourseInfo;
            // daily_hours가 명시된 경우 시간 기반(단기) 처리
            // daily_hours가 없을 때만 total_days/total_hours 기준으로 장기 판별
            const isLongTerm = !daily_hours && (total_days >= 10 && total_hours >= 40);

            // 실제 일일 수업 분: training_time start~end 차이
            // daily_hours 설정값이 잘못되어도 실제 시간 반영
            function calcDailyMinutesH(start: string, end: string): number {
                if (!start || !end) return 0;
                const [sh, sm] = start.split(':').map(Number);
                const [eh, em] = end.split(':').map(Number);
                const diff = (eh * 60 + em) - (sh * 60 + sm);
                return diff > 0 ? diff : 0;
            }
            const actualDailyMinutes = training_time_start && training_time_end
                ? calcDailyMinutesH(training_time_start, training_time_end)
                : (daily_hours || 0) * 60;

            const { results: logs } = await c.env.DB.prepare(`
                SELECT al.date, al.check_in_time as check_in, al.check_out_time as check_out, al.status
                FROM attendance_logs al
                JOIN course_session_enrollments cse ON al.enrollment_id = cse.id
                WHERE cse.session_id = ? AND cse.user_id = ?
            `).bind(session_id, id).all() as { results: any[] };

            let presentCount = 0;
            let absentCount = 0;
            let lateCount = 0;
            let earlyCount = 0;
            let outCount = 0;
            let accumulatedMinutes = 0;

            // byDate: 날짜별 단일 merge (courses.ts와 동일 구조)
            const byDate = new Map<string, { check_in?: string; check_out?: string; status?: string }>();
            (logs || []).forEach((log: any) => {
                const d = (log.date || '').toString().split('T')[0];
                if (!d) return;
                if (byDate.has(d)) {
                    const existing = byDate.get(d)!;
                    if (log.status === 'absent' || log.status === 'absent_under_50') {
                        existing.status = log.status;
                    } else if (
                        (existing.status === 'late' && log.status === 'early_leave') ||
                        (existing.status === 'early_leave' && log.status === 'late')
                    ) {
                        const lateCheckIn = existing.status === 'late' ? existing.check_in : log.check_in;
                        const earlyCheckOut = existing.status === 'late' ? log.check_out : existing.check_out;
                        existing.status = 'late_and_early';
                        existing.check_in = lateCheckIn;
                        existing.check_out = earlyCheckOut;
                    }
                } else {
                    byDate.set(d, { check_in: log.check_in, check_out: log.check_out, status: log.status });
                }
            });
            const daysProgressed = byDate.size;

            byDate.forEach((day) => {
                const { status, check_in, check_out } = day;
                if (status === 'present') presentCount++;
                else if (status === 'absent' || status === 'absent_under_50') absentCount++;
                else if (status === 'late') lateCount++;
                else if (status === 'early_leave') earlyCount++;
                else if (status === 'public_leave') outCount++;
                else if (status === 'late_and_early') { lateCount++; earlyCount++; }

                if (!isLongTerm) {
                    accumulatedMinutes += calcAttendedMinutes(
                        status, check_in, check_out,
                        training_time_start || '00:00',
                        training_time_end || '23:59',
                        actualDailyMinutes
                    );
                }
            });


            if (isLongTerm) {
                // 환산 결석일: 순수 결석일수 + Math.floor((누적 지각 + 조퇴 + 외출) / 3)
                const penaltyDays = Math.floor((lateCount + earlyCount + outCount) / 3);
                const totalAbsentConverted = absentCount + penaltyDays;

                const currentAttendanceRate = daysProgressed > 0
                    ? Math.max(0, ((daysProgressed - totalAbsentConverted) / daysProgressed) * 100).toFixed(1)
                    : '0.0';
                const finalAttendanceRate = total_days > 0
                    ? Math.max(0, ((total_days - totalAbsentConverted) / total_days) * 100).toFixed(1)
                    : '0.0';

                attendance_rate = parseFloat(currentAttendanceRate);
                advanced_attendance = {
                    type: 'days',
                    isLongTerm: true,
                    daysProgressed,
                    totalDays: total_days,
                    absent: absentCount,
                    late: lateCount,
                    early: earlyCount,
                    outing: outCount,
                    totalAbsentConverted,
                    currentRate: currentAttendanceRate,
                    finalRate: finalAttendanceRate
                };
            } else {
                // 단기(시간 기반) 과정
                // timetable 기반으로 분모 계산 + actualDailyMinutes 사용
                const isClosed2 = (session_status || '') === 'closed';
                const today2 = new Date().toISOString().split('T')[0];
                const { results: timetableRows2 } = await c.env.DB.prepare(`
                    SELECT DISTINCT training_date FROM session_timetable
                    WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
                    ORDER BY training_date ASC
                `).bind(session_id).all() as { results: { training_date: string }[] };

                const tblDates = (timetableRows2 || []).map((r: any) => (r.training_date || '').toString().substring(0, 10)).filter(Boolean);
                const tblTotalDays = tblDates.length;
                const tblProgressedDays = isClosed2 ? tblTotalDays : tblDates.filter(d => d <= today2).length;

                const expectedTotalMinutes = tblTotalDays > 0
                    ? Math.round(tblTotalDays * actualDailyMinutes)
                    : (total_hours > 0 ? Math.round(total_hours * 60) : 0);
                const expectedCurrentMinutes = tblProgressedDays > 0
                    ? Math.round(tblProgressedDays * actualDailyMinutes)
                    : (daysProgressed > 0 ? Math.round(daysProgressed * actualDailyMinutes) : 0);

                // 분자: 결석일 제외 누적분 (클램핑 없음)
                const rawAccumulated = Math.round(accumulatedMinutes);

                // currentRate: 현재 진행일 기준 출석률
                const currentAttendanceRate = expectedCurrentMinutes > 0
                    ? Math.min(100, (rawAccumulated / expectedCurrentMinutes * 100)).toFixed(1)
                    : '0.0';
                // finalRate: 전체 과정 기준 수료 예상 출석률
                const finalAttendanceRate = expectedTotalMinutes > 0
                    ? Math.min(100, (rawAccumulated / expectedTotalMinutes) * 100).toFixed(1)
                    : '0.0';

                attendance_rate = parseFloat(currentAttendanceRate);
                advanced_attendance = {
                    type: 'minutes',
                    isLongTerm: false,
                    accumulatedMinutes: rawAccumulated,
                    expectedCurrentMinutes,
                    expectedTotalMinutes,
                    currentRate: currentAttendanceRate,
                    finalRate: finalAttendanceRate,
                    absent: absentCount,
                    late: lateCount,
                    early: earlyCount,
                };
            }
        } else {
            // 레거시 폴백 혹은 수강이력 없는 경우
            const attRow = await c.env.DB.prepare(`
                SELECT
                            (SELECT COUNT(*) FROM attendance_logs al
                     JOIN course_session_enrollments cse ON al.enrollment_id = cse.id
                     WHERE cse.user_id = ? AND al.status NOT IN ('absent', 'absent_under_50')) as attended,
                        (SELECT COUNT(*) FROM attendance_logs al
                     JOIN course_session_enrollments cse ON al.enrollment_id = cse.id
                     WHERE cse.user_id = ?) as total
                    `).bind(id, id).first() as { attended: number; total: number };
            const totalLogs = attRow?.total ?? 0;
            const attended = attRow?.attended ?? 0;
            attendance_rate = totalLogs > 0 ? Math.round((attended / totalLogs) * 100) : 0;
        }

        // 동시 수강 과정 목록 (enrolled/approved, 진행중·모집중 포함) — 사이드바·수강관리에서 2개 이상 표시용
        const { results: currentCoursesRows } = await c.env.DB.prepare(`
            SELECT ac.name as course_name, cs.session_number, cs.session_name, cs.status as session_status
            FROM course_session_enrollments cse
            JOIN course_sessions cs ON cse.session_id = cs.id
            JOIN approved_courses ac ON cs.approved_course_id = ac.id
            WHERE cse.user_id = ? AND cse.status IN ('enrolled', 'approved')
            ORDER BY cs.training_start_date DESC
        `).bind(id).all() as { results: { course_name: string; session_number: number; session_name: string | null; session_status: string }[] };
        const current_courses = (currentCoursesRows || []).map((row: any) => ({
            name: row.course_name,
            session_number: row.session_number,
            session_name: row.session_name || null,
            session_status: row.session_status || null
        }));

        const data = {
            ...r,
            course_id: r.course_id || null,
            current_course_name: r.current_course_name || null,
            current_courses: current_courses,
            status: r.status || 'consulting',
            type: r.type || 'jobseeker',
            last_consult: r.last_consult || null,
            has_application: !!r.has_application,
            has_card: !!r.has_card,
            is_hrd_net_registered: !!r.is_hrd_net_registered,
            consultation_count,
            attendance_rate,
            advanced_attendance
        };
        return c.json({ success: true, data });
    } catch (e: any) {
        console.error('Failed to fetch student:', e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// DB 연결 테스트용 엔드포인트
app.get('/db-check', async (c) => {
    try {
        const { results } = await c.env.DB.prepare("SELECT 1 as val").all();
        return c.json({ success: true, message: "DB Connection OK", val: results[0].val });
    } catch (e: any) {
        return c.json({ success: false, error: e.message, stack: e.stack }, 500);
    }
});

// 훈련생 등록
// 훈련생 등록
app.post('/students', async (c) => {
    try {
        const body = await c.req.json();
        const {
            name, email, phone, birthdate, gender, address, education,
            certifications, type, status, course_id, package_type, payment_method, payment_method_note,
            payment_date, self_pay_amount, has_application, has_card,
            is_hrd_net_registered, status_memo, profile_image
        } = body;

        if (!name || !phone) {
            return c.json({ success: false, error: '이름과 연락처는 필수항목입니다.' }, 400);
        }

        // 1. 사용자 확인/생성
        let user: any = await c.env.DB.prepare("SELECT id FROM users WHERE phone = ?").bind(phone).first();
        let userId: number;

        const valEmail = email || `${phone} @temp.com`;
        const valBirthdate = birthdate || null;
        const valGender = gender || 'M';
        const valAddress = address || null;
        const valEducation = education || null;
        const valCertifications = certifications || null;
        const valProfileImage = profile_image || null;

        if (!user) {
            // 신규 회원 생성
            const result = await c.env.DB.prepare(
                "INSERT INTO users (email, password, name, phone, role, status, birthdate, gender, address, education, certifications, profile_image) VALUES (?, ?, ?, ?, 'student', 'active', ?, ?, ?, ?, ?, ?)"
            ).bind(valEmail, 'temp_password', name, phone, valBirthdate, valGender, valAddress, valEducation, valCertifications, valProfileImage).run();
            userId = result.meta.last_row_id as number;
        } else {
            userId = user.id;
            // 기존 회원 정보 업데이트
            await c.env.DB.prepare("UPDATE users SET role = 'student', name = ?, phone = ?, email = ?, birthdate = ?, gender = ?, address = ?, education = ?, certifications = ?, profile_image = ? WHERE id = ?")
                .bind(name, phone, valEmail, valBirthdate, valGender, valAddress, valEducation, valCertifications, valProfileImage, userId).run();
        }

        const hrdCourseId = course_id ? parseInt(course_id) : null;

        // 기본값 처리
        const valStatus = status || 'consulting';
        const valType = type || 'jobseeker';
        const valPackageType = normalizePackageType(package_type);
        const valPaymentMethod = normalizePaymentMethod(payment_method);
        const valPaymentMethodNote = (payment_method_note != null && String(payment_method_note).trim() !== '') ? String(payment_method_note).trim() : null;
        const valPaymentDate = payment_date || null;
        const valSelfPayAmount = parseInt(self_pay_amount || '0') || 0;
        const valStatusMemo = status_memo || null;

        // 2. HRD 상세 정보 등록/업데이트
        await c.env.DB.prepare(`
            INSERT INTO hrd_student_details(
                        user_id, course_id, status, type, package_type, payment_method, payment_method_note, payment_date,
                        self_pay_amount, has_application, has_card, is_hrd_net_registered,
                        status_memo
                    ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                    course_id = ?, status = ?, type = ?, package_type = ?, payment_method = ?, payment_method_note = ?,
                        payment_date = ?, self_pay_amount = ?, has_application = ?, has_card = ?,
                        is_hrd_net_registered = ?, status_memo = ?,
                        updated_at = CURRENT_TIMESTAMP
                            `).bind(
            userId, hrdCourseId, valStatus, valType, (valPackageType ?? ''), (valPaymentMethod ?? ''), valPaymentMethodNote, valPaymentDate,
            valSelfPayAmount, has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, valStatusMemo,
            // UPDATE values
            hrdCourseId, valStatus, valType, (valPackageType ?? ''), (valPaymentMethod ?? ''), valPaymentMethodNote, valPaymentDate,
            valSelfPayAmount, has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, valStatusMemo
        ).run();

        return c.json({ success: true, data: { id: userId } });
    } catch (e: any) {
        console.error('Failed to register student:', e);
        return c.json({ success: false, error: '훈련생 등록 실패: ' + e.message }, 500);
    }
});

// 훈련생 수정
app.put('/students', async (c) => {
    try {
        const body = await c.req.json();
        const {
            id, name, email, phone, birthdate, gender, address, education,
            certifications, type, status, course_id, package_type, payment_method, payment_method_note,
            payment_date, self_pay_amount, has_application, has_card,
            is_hrd_net_registered, status_memo, profile_image
        } = body;

        if (!id) return c.json({ success: false, error: 'ID가 필요합니다.' }, 400);

        const valEmail = email || null;
        const valBirthdate = birthdate || null;
        const valGender = gender || 'M';
        const valAddress = address || null;
        const valEducation = education || null;
        const valCertifications = certifications || null;
        const valProfileImage = profile_image || null;

        // 1. 사용자 기본 정보 업데이트 (profile_image 포함)
        await c.env.DB.prepare("UPDATE users SET name = ?, phone = ?, email = ?, birthdate = ?, gender = ?, address = ?, education = ?, certifications = ?, profile_image = ? WHERE id = ?")
            .bind(name, phone, valEmail, valBirthdate, valGender, valAddress, valEducation, valCertifications, valProfileImage, id).run();

        const hrdCourseId = course_id ? parseInt(course_id) : null;

        const valPaymentMethodNote = (payment_method_note != null && String(payment_method_note).trim() !== '') ? String(payment_method_note).trim() : null;
        // 2. HRD 상세 정보 업데이트 (레코드가 없을 경우를 대비해 UPSERT 수행)
        await c.env.DB.prepare(`
            INSERT INTO hrd_student_details(
                                user_id, course_id, status, type, package_type, payment_method, payment_method_note,
                                payment_date, self_pay_amount, has_application, has_card,
                                is_hrd_net_registered, status_memo
                            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                    course_id = ?, status = ?, type = ?, package_type = ?, payment_method = ?, payment_method_note = ?,
                        payment_date = ?, self_pay_amount = ?, has_application = ?, has_card = ?,
                        is_hrd_net_registered = ?, status_memo = ?,
                        updated_at = CURRENT_TIMESTAMP
                            `).bind(
            id, hrdCourseId, status || 'consulting', type || 'jobseeker', (normalizePackageType(package_type) ?? ''), (normalizePaymentMethod(payment_method) ?? ''), valPaymentMethodNote, payment_date || null,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo || null,
            hrdCourseId, status || 'consulting', type || 'jobseeker', (normalizePackageType(package_type) ?? ''), (normalizePaymentMethod(payment_method) ?? ''), valPaymentMethodNote, payment_date || null,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo || null
        ).run();

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Failed to update student:', e);
        return c.json({ success: false, error: '훈련생 수정 실패: ' + e.message }, 500);
    }
});

// 훈련생 결제 목록 조회 (다건)
app.get('/students/:id/payments', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const userId = parseInt(id, 10);
        if (isNaN(userId)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const { results } = await c.env.DB.prepare(
            `SELECT id, user_id, payment_method, payment_method_note, payment_date, amount, created_at
             FROM hrd_student_payments WHERE user_id = ? ORDER BY payment_date DESC, created_at DESC`
        ).bind(userId).all();
        return c.json({ success: true, data: results || [] });
    } catch (e: any) {
        console.error('Failed to fetch payments:', e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// 훈련생 결제 1건 추가 (결재 저장)
app.post('/students/:id/payments', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const userId = parseInt(id, 10);
        if (isNaN(userId)) return c.json({ success: false, error: '잘못된 ID' }, 400);
        const body = await c.req.json();
        const { payment_method, payment_method_note, payment_date, amount } = body;
        const method = normalizePaymentMethod(payment_method);
        if (!method || method === '') return c.json({ success: false, error: '결제 수단을 선택해 주세요. (카드/계좌이체/현금)' }, 400);
        const note = (payment_method_note != null && String(payment_method_note).trim() !== '') ? String(payment_method_note).trim() : null;
        const date = payment_date || null;
        const amt = parseInt(amount || '0', 10) || 0;
        await c.env.DB.prepare(
            `INSERT INTO hrd_student_payments (user_id, payment_method, payment_method_note, payment_date, amount)
             VALUES (?, ?, ?, ?, ?)`
        ).bind(userId, method, note, date, amt).run();
        return c.json({ success: true, message: '결재가 저장되었습니다.' });
    } catch (e: any) {
        console.error('Failed to add payment:', e);
        return c.json({ success: false, error: '결재 저장 실패: ' + e.message }, 500);
    }
});

// 상담자 목록 (관리자·강사 — 상담 수정 시 지정용)
app.get('/counselors', authMiddleware, async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            `SELECT id, name FROM users WHERE role IN('admin', 'teacher', 'instructor') AND status = 'active' ORDER BY name ASC`
        ).all();
        return c.json({ success: true, data: results || [] });
    } catch (e: any) {
        console.error('Failed to fetch counselors:', e);
        return c.json({ success: false, error: e.message }, 500);
    }
});

// 상담 이력 조회 (상담일지 통합 및 권한 필터링)
app.get('/students/:id/consultations', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const user = c.get('user'); // JWTPayload
        const allForTeacher = c.req.query('all') === '1';

        let query = `
                    SELECT
                    cl.id,
                        cl.counselor_id,
                        cl.content as message,
                        cl.counseling_date as consult_date,
                        u.name as memo,
                        u.role as counselor_role,
                        cl.category,
                        cl.method,
                        cl.created_at
            FROM hrd_counseling_logs cl
            LEFT JOIN users u ON cl.counselor_id = u.id
            WHERE cl.student_id = ?
                        `;

        const params: any[] = [id];

        // 권한: admin은 전체, teacher는 기본 본인만 / ?all=1 이면 해당 수강생 전체 상담 (강사 상담 페이지용)
        if (user.role === 'teacher' && !allForTeacher) {
            query += " AND cl.counselor_id = ? ";
            params.push(user.userId);
        }

        query += " ORDER BY cl.counseling_date DESC, cl.created_at DESC";

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        console.error('Failed to fetch consultations:', e);
        return c.json({ success: false, error: '상담 이력 조회 실패: ' + e.message }, 500);
    }
});

// 상담 이력 추가 (상담일지 통합) — 로그인한 사용자를 상담자로 사용
app.post('/students/:id/consultations', authMiddleware, async (c) => {
    try {
        const studentId = c.req.param('id');
        const body = await c.req.json();
        const content = body.content != null ? String(body.content) : '';
        const date = body.date || new Date().toISOString().split('T')[0];
        const category = body.category || 'academic';
        const method = body.method || 'face_to_face';
        let courseId = body.course_id != null ? (typeof body.course_id === 'number' ? body.course_id : parseInt(String(body.course_id), 10) || null) : null;
        const user = c.get('user') as JWTPayload;
        const counselorId = user.userId;

        // course_id는 courses(id) FK — 강사 페이지에서 오는 값은 회차(session) ID일 수 있으므로, 회차면 동일 해석 로직으로 LMS 과정 ID로 저장
        if (courseId != null) {
            const resolved = await resolveSessionToLmsCourseId(c.env.DB, courseId);
            courseId = resolved;
        }

        // hrd_counseling_logs 에 저장
        await c.env.DB.prepare(`
            INSERT INTO hrd_counseling_logs(
                student_id, counselor_id, course_id, counseling_date,
                category, method, content, created_at, updated_at
            ) VALUES(?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(studentId, counselorId, courseId, date, category, method, content).run();

        // last_consult 업데이트 (hrd_student_details 행이 없어도 상담 저장은 성공 처리)
        try {
            await c.env.DB.prepare(`
                UPDATE hrd_student_details SET last_consult = ? WHERE user_id = ?
            `).bind(date, studentId).run();
        } catch (_) {
            // 테이블/컬럼 없거나 행 없음 시 무시
        }

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Failed to add consultation:', e);
        return c.json({ success: false, error: '상담 이력 추가 실패: ' + (e?.message || String(e)) }, 500);
    }
});

// 훈련생 수강 이력 조회 (회차별)
app.get('/students/:id/enrollments', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const { DB } = c.env;

        const { results } = await DB.prepare(`
            SELECT
                    cs.id as session_id,
                        cs.session_number,
                        cs.session_name,
                        cs.training_start_date,
                        cs.training_end_date,
                        cs.status as session_status,
                        ac.name as course_name,
                        cse.status as enrollment_status,
                        cse.enrolled_at
            FROM course_session_enrollments cse
            JOIN course_sessions cs ON cse.session_id = cs.id
            JOIN approved_courses ac ON cs.approved_course_id = ac.id
            WHERE cse.user_id = ?
                        ORDER BY cs.training_start_date DESC
                            `).bind(id).all();

        return c.json({ success: true, data: results || [] });
    } catch (e: any) {
        console.error('Failed to fetch student enrollments:', e);
        return c.json({ success: false, error: '수강 이력 조회 실패: ' + e.message }, 500);
    }
});

// ============================================
// 훈련시설 관리 API
// ============================================

// 훈련시설 목록 조회
app.get('/facilities', async (c) => {
    try {
        const search = c.req.query('search');
        let query = `
            SELECT f.*,
                        (SELECT url FROM hrd_facility_images WHERE facility_id = f.id ORDER BY created_at DESC LIMIT 1) as image_url
            FROM hrd_facilities f 
            WHERE 1 = 1
                `;
        const params: any[] = [];

        if (search) {
            query += " AND name LIKE ?";
            params.push(`% ${search}% `);
        }

        query += " ORDER BY name ASC";
        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facilities:', e);
        return c.json({ success: false, error: '훈련시설 목록 조회 실패' }, 500);
    }
});

// 훈련시설 등록
app.post('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { name, area, managerMain, managerSub, description, image_url } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_facilities(name, area, manager_main, manager_sub, description, status)
            VALUES(?, ?, ?, ?, ?, '양호')
                `).bind(name, area ? parseFloat(area) : null, managerMain || null, managerSub || null, description || null).run();

        const facilityId = result.meta.last_row_id;

        // 초기 이미지가 있는 경우 이미지 테이블에도 등록
        if (image_url) {
            await c.env.DB.prepare(`
                INSERT INTO hrd_facility_images(facility_id, name, size, url)
            VALUES(?, ?, ?, ?)
                `).bind(facilityId, 'initial_photo.jpg', Math.round(image_url.length * 0.75), image_url).run();
        }

        return c.json({ success: true, data: { id: facilityId } });
    } catch (e) {
        console.error('Failed to create facility:', e);
        return c.json({ success: false, error: '훈련시설 등록 실패' }, 500);
    }
});

// 훈련시설 수정
app.put('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { id, name, area, managerMain, managerSub, description, status, image_url } = body;

        await c.env.DB.prepare(`
            UPDATE hrd_facilities 
            SET name = ?, area = ?, manager_main = ?, manager_sub = ?, description = ?, status = ?
                WHERE id = ?
                    `).bind(name, area ? parseFloat(area) : null, managerMain || null, managerSub || null, description || null, status, id).run();

        if (image_url) {
            await c.env.DB.prepare(`
                INSERT INTO hrd_facility_images(facility_id, name, size, url)
            VALUES(?, ?, ?, ?)
            `).bind(id, 'manual_update.jpg', Math.round(image_url.length * 0.75), image_url).run();
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update facility:', e);
        return c.json({ success: false, error: '훈련시설 수정 실패' }, 500);
    }
});

// 훈련시설 삭제
app.delete('/facilities/:id', async (c) => {
    try {
        const id = c.req.param('id');

        // 외래 키 제약 조건 오류 방지를 위해 관련 데이터를 먼저 수동으로 삭제
        await c.env.DB.batch([
            c.env.DB.prepare("DELETE FROM hrd_facility_maintenance WHERE facility_id = ?").bind(id),
            c.env.DB.prepare("DELETE FROM hrd_facility_images WHERE facility_id = ?").bind(id),
            c.env.DB.prepare("DELETE FROM hrd_facility_items WHERE facility_id = ?").bind(id),
            c.env.DB.prepare("DELETE FROM hrd_facility_reservations WHERE facility_id = ?").bind(id),
            c.env.DB.prepare("DELETE FROM hrd_facilities WHERE id = ?").bind(id)
        ]);

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete facility:', e);
        return c.json({ success: false, error: '훈련시설 삭제 실패: ' + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});

// 시설 관리 대장 조회
app.get('/facilities/:id/maintenance', async (c) => {
    try {
        const id = c.req.param('id');

        const fId = parseInt(id);
        if (isNaN(fId)) return c.json({ success: false, error: `유효하지 않은 시설 ID: ${id} ` }, 400);

        try {
            // 안전 장치: 테이블이 없으면 생성
            await c.env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS hrd_facility_maintenance(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                facility_id INTEGER,
                status TEXT,
                title TEXT,
                price INTEGER DEFAULT 0,
                vendor TEXT,
                manager TEXT,
                memo TEXT,
                date TEXT,
                progress TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
                `).run();

            // 기존 테이블 컬럼 마이그레이션 (개별 try-catch로 독립 실행)
            try {
                await c.env.DB.prepare("ALTER TABLE hrd_facility_maintenance ADD COLUMN progress TEXT DEFAULT 'pending'").run();
            } catch (ignore) { }

            try {
                await c.env.DB.prepare("ALTER TABLE hrd_facility_maintenance ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
            } catch (ignore) { }

            const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_facility_maintenance 
                WHERE facility_id = ?
                ORDER BY date DESC, created_at DESC
            `).bind(fId).all();

            return c.json({ success: true, data: results || [] });
        } catch (dbError) {
            console.error('DB Error fetching maintenance logs:', dbError);
            return c.json({
                success: false,
                error: '[v4-GET] 데이터베이스 오류: ' + (dbError instanceof Error ? dbError.message : String(dbError))
            }, 500);
        }
    } catch (e) {
        console.error('General Error in fetching maintenance logs:', e);
        return c.json({ success: false, error: '[v4-GET] 알 수 없는 오류: ' + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});

// 시설 관리 대장 항목 수정 (점검/수리 내용 수정)
app.put('/facilities/maintenance/:logId', async (c) => {
    try {
        const logId = c.req.param('logId');
        const body = await c.req.json();
        const { progress, title, price, vendor, manager, memo, date } = body;

        // 동적 업데이트 쿼리 (SET 구문을 동적으로 생성)
        const updates: string[] = [];
        const params: any[] = [];

        if (progress) { updates.push("progress = ?"); params.push(progress); }
        if (title !== undefined) { updates.push("title = ?"); params.push(title); }
        if (price !== undefined) { updates.push("price = ?"); params.push(parseInt(price || 0)); }
        if (vendor !== undefined) { updates.push("vendor = ?"); params.push(vendor); }
        if (manager !== undefined) { updates.push("manager = ?"); params.push(manager); }
        if (memo !== undefined) { updates.push("memo = ?"); params.push(memo); }
        if (date) { updates.push("date = ?"); params.push(date); }

        if (updates.length === 0) {
            return c.json({ success: true, message: '변경 내용 없음' });
        }

        const query = `UPDATE hrd_facility_maintenance SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ? `;
        params.push(logId);

        try {
            await c.env.DB.prepare(query).bind(...params).run();
        } catch (dbError) {
            // updated_at 컬럼이 없을 경우를 대비한 폴백 (과도기적 조치)
            const fallbackQuery = `UPDATE hrd_facility_maintenance SET ${updates.join(", ")} WHERE id = ? `;
            await c.env.DB.prepare(fallbackQuery).bind(...params).run();
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to update maintenance log:', e);
        return c.json({
            success: false,
            error: '수정 실패: ' + (e instanceof Error ? e.message : String(e))
        }, 500);
    }
});

// 시설 관리 대장 항목 삭제 (점검기록/수리요청 삭제)
app.delete('/facilities/maintenance/:logId', async (c) => {
    try {
        const logId = c.req.param('logId');
        const id = parseInt(logId);
        if (isNaN(id)) return c.json({ success: false, error: '유효하지 않은 기록 ID입니다.' }, 400);
        await c.env.DB.prepare('DELETE FROM hrd_facility_maintenance WHERE id = ?').bind(id).run();
        return c.json({ success: true, message: '삭제되었습니다.' });
    } catch (e) {
        console.error('Failed to delete maintenance log:', e);
        return c.json({ success: false, error: '삭제 실패: ' + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});

// 시설 관리 대장 등록
app.post('/facilities/:id/maintenance', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { status, title, price, vendor, manager, memo, date } = body;

        // Check의 경우 기본 progress는 'completed', Repair는 'pending'
        // const progress = status === 'check' ? 'completed' : 'pending'; (DB 컬럼 없음)

        if (!facilityId) return c.json({ success: false, error: '시설 ID가 필요합니다.' }, 400);

        const fId = parseInt(facilityId);
        if (isNaN(fId)) return c.json({ success: false, error: `유효하지 않은 시설 ID: ${facilityId} ` }, 400);

        // 상세 로그 로깅 (서버 콘솔용)
        console.log(`Adding maintenance log: facilityId = ${fId}, status = ${status}, title = ${title} `);

        try {
            await c.env.DB.prepare(`
                INSERT INTO hrd_facility_maintenance(facility_id, status, title, price, vendor, manager, memo, date)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                fId,
                status || null,
                title || null,
                parseInt(price || 0),
                vendor || null,
                manager || '관리자',
                memo || null,
                date || new Date().toISOString()
            ).run();

            // 시설의 최종 점검일 및 상태 업데이트
            await c.env.DB.prepare(`
                UPDATE hrd_facilities SET last_check = ?, status = ? WHERE id = ?
                `).bind(date || new Date().toISOString(), status === 'repair' ? '점검필요' : '양호', fId).run();

            return c.json({ success: true });
        } catch (dbError) {
            console.error('DB Error adding maintenance log:', dbError);
            return c.json({
                success: false,
                error: '[v3] 데이터베이스 오류: ' + (dbError instanceof Error ? dbError.message : String(dbError))
            }, 500);
        }
    } catch (e) {
        console.error('General Error in maintenance log registration:', e);
        return c.json({ success: false, error: '[v3] 알 수 없는 오류: ' + (e instanceof Error ? e.message : String(e)) }, 500);
    }
});

// 시설 이미지 조회
app.get('/facilities/:id/images', async (c) => {
    try {
        const id = c.req.param('id');
        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_facility_images WHERE facility_id = ? ORDER BY created_at DESC
                `).bind(id).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facility images:', e);
        return c.json({ success: false, error: '시설 이미지 조회 실패' }, 500);
    }
});

// 시설 이미지 등록 (실제 파일 업로드는 별도 처리하거나 URL만 저장)
app.post('/facilities/:id/images', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { name, size, url } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_facility_images(facility_id, name, size, url)
            VALUES(?, ?, ?, ?)
                `).bind(facilityId, name, size, url).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e) {
        console.error('Failed to add facility image:', e);
        return c.json({ success: false, error: '시설 이미지 등록 실패' }, 500);
    }
});

// 개별 이미지 삭제
app.delete('/facilities/images/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare("DELETE FROM hrd_facility_images WHERE id = ?").bind(id).run();
        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to delete image:', e);
        return c.json({ success: false, error: '이미지 삭제 실패' }, 500);
    }
});

// 시설 내 물품 목록 조회
app.get('/facilities/:id/items', async (c) => {
    try {
        const id = c.req.param('id');
        // 1. Get facility name
        const facility: any = await c.env.DB.prepare("SELECT name FROM hrd_facilities WHERE id = ?").bind(id).first();
        if (!facility) return c.json({ success: false, error: '시설을 찾을 수 없습니다.' }, 404);

        // 2. Search items where location contains facility name (simple matching)
        const { results } = await c.env.DB.prepare("SELECT * FROM hrd_items WHERE location LIKE ?").bind(`% ${facility.name}% `).all();

        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch facility items:', e);
        return c.json({ success: false, error: '시설 물품 조회 실패' }, 500);
    }
});

// ============================================
// 출석 관리 API
// ============================================

// 출석 현황 조회 (특정 날짜, 특정 과정)
app.get('/attendance', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const courseId = c.req.query('courseId');
        const date = c.req.query('date');

        if (!courseId || !date) {
            return c.json({ success: false, error: '과정과 날짜를 선택해주세요.' }, 400);
        }

        const rawId = parseInt(courseId, 10);
        let isSession = false;

        // 1. 회차(course_sessions)인지 먼저 확인
        const session: any = await c.env.DB.prepare("SELECT id FROM course_sessions WHERE id = ?").bind(rawId).first();
        if (session) {
            isSession = true;
        }

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            if (isSession) {
                // 회차인 경우: 시간표에 배정된 강사인지 확인
                const isInstructor = await c.env.DB.prepare("SELECT 1 FROM session_timetable WHERE session_id = ? AND instructor_id = ? LIMIT 1").bind(rawId, user.userId).first();
                if (!isInstructor) {
                    return forbiddenResponse(c, '이 회차에 대한 권한이 없습니다.');
                }
            } else {
                // 일반 과정인 경우: 과정 담당 강사인지 확인
                const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(rawId).first();
                if (!course || course.teacher_id !== user.userId) {
                    return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
                }
            }
        }

        // 2. 해당 과정의 수강생 목록 및 출석 정보 조회
        let query = '';
        if (isSession) {
            // HRD 회차용 쿼리
            query = `
                SELECT
                    u.id, u.name, u.phone,
                    '' as package_type,
                    cse.id as enrollment_id,
                    al.status,
                    al.check_in_time as in_time,
                    al.check_out_time as out_time,
                    al.note as memo
                FROM users u
                JOIN course_session_enrollments cse ON u.id = cse.user_id
                LEFT JOIN hrd_student_details d ON u.id = d.user_id
                LEFT JOIN attendance_logs al ON cse.id = al.enrollment_id AND al.date = ?
                WHERE cse.session_id = ? AND u.role = 'student'
                ORDER BY u.name ASC
            `;
        } else {
            // 일반 과정용 쿼리
            query = `
                SELECT
                    u.id, u.name, u.phone,
                    d.package_type,
                    e.id as enrollment_id,
                    al.status,
                    al.check_in_time as in_time,
                    al.check_out_time as out_time,
                    al.note as memo
                FROM users u
                LEFT JOIN hrd_student_details d ON u.id = d.user_id
                JOIN enrollments e ON u.id = e.user_id
                LEFT JOIN attendance_logs al ON e.id = al.enrollment_id AND al.date = ?
                WHERE e.course_id = ? AND u.role = 'student'
                ORDER BY u.name ASC
            `;
        }

        const { results } = await c.env.DB.prepare(query).bind(date, rawId).all();

        // 데이터 포맷팅
        const resultData = results.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            package_type: row.package_type || '',
            status: row.status || 'pending', // 값이 없으면 미처리 상태
            in_time: row.in_time || '',
            out_time: row.out_time || '',
            memo: row.memo || ''
        }));

        return c.json({ success: true, data: resultData });
    } catch (e) {
        console.error('Failed to fetch attendance:', e);
        return c.json({ success: false, error: '출석 현황 조회 실패' }, 500);
    }
});

// 전체 과정 출석 요약 정보 조회 (페이지네이션, 검색, 과정 상태 필터 지원)
// stats=cumulative: 현재까지 누적 통계(출석/지각/결석), pending은 선택일 기준 | stats=today: 선택일만
app.get('/attendance/summary', authMiddleware, async (c) => {
    try {
        const date = c.req.query('date') || new Date().toISOString().split('T')[0];
        const statsScope = (c.req.query('stats') || 'cumulative').toLowerCase(); // cumulative | today
        const page = Math.max(1, parseInt(c.req.query('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '10')));
        const search = c.req.query('search') || '';
        const statusFilter = (c.req.query('status') || 'all').toLowerCase();
        const offset = (page - 1) * limit;

        let whereClause = "";
        const searchParams: (string | number)[] = [];
        if (search) {
            whereClause = " AND (a.name LIKE ? OR s.instructor_name LIKE ?)";
            searchParams.push(`%${search}%`, `%${search}%`);
        }
        if (statusFilter && statusFilter !== 'all' && ['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
            whereClause += " AND s.status = ?";
            searchParams.push(statusFilter);
        }

        const coursesQuery = `
            SELECT s.id, s.status, (a.name || ' (' || s.session_number || '회차' || CASE WHEN s.session_name IS NOT NULL AND TRIM(s.session_name) <> '' THEN ' - ' || s.session_name ELSE '' END || ')') as title, s.instructor_name as teacher_name, 'hrd' as type, s.created_at
            FROM course_sessions s
            JOIN approved_courses a ON s.approved_course_id = a.id
            WHERE 1=1
            ${whereClause}
            ORDER BY s.training_start_date DESC, s.id DESC
        `;

        const { results: allCourses } = await c.env.DB.prepare(coursesQuery).bind(...searchParams).all();
        const total = allCourses ? allCourses.length : 0;

        const dateCondition = statsScope === 'today' ? ' AND al.date = ?' : '';
        const dateParam = statsScope === 'today' ? [date] : [];
        const countStudents = statsScope === 'today' ? 'COUNT(e.id)' : 'COUNT(DISTINCT e.id)';

        // 1) 일반 과정 통계
        const generalStatsQuery = `
            SELECT 
                e.course_id as id, 
                ${countStudents} as total_students,
                SUM(CASE WHEN al.status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN al.status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN al.status = 'early_leave' THEN 1 ELSE 0 END) as early,
                SUM(CASE WHEN al.status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN al.status = 'public_leave' THEN 1 ELSE 0 END) as public_leave,
                SUM(CASE WHEN al.status = 'absent_under_50' THEN 1 ELSE 0 END) as absent_under_50,
                SUM(CASE WHEN al.status = 'late_and_early' THEN 1 ELSE 0 END) as late_and_early
            FROM enrollments e
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id ${dateCondition}
            WHERE e.status IN ('approved', 'enrolled', 'active')
            GROUP BY e.course_id
        `;
        const { results: generalStatsResults } = await c.env.DB.prepare(generalStatsQuery).bind(...dateParam).all();
        const generalStatsMap = new Map((generalStatsResults || []).map((r: any) => [r.id, r]));

        // 2) HRD 회차 통계 (출석/지각/결석 = 누적 또는 당일)
        const hrdStatsQuery = `
            SELECT 
                e.session_id as id, 
                ${countStudents} as total_students,
                SUM(CASE WHEN al.status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN al.status = 'late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN al.status = 'early_leave' THEN 1 ELSE 0 END) as early,
                SUM(CASE WHEN al.status = 'absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN al.status = 'public_leave' THEN 1 ELSE 0 END) as public_leave,
                SUM(CASE WHEN al.status = 'absent_under_50' THEN 1 ELSE 0 END) as absent_under_50,
                SUM(CASE WHEN al.status = 'late_and_early' THEN 1 ELSE 0 END) as late_and_early
            FROM course_session_enrollments e
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id ${dateCondition}
            WHERE e.status IN ('approved', 'enrolled', 'active')
            GROUP BY e.session_id
        `;
        const { results: hrdStatsResults } = await c.env.DB.prepare(hrdStatsQuery).bind(...dateParam).all();
        const hrdStatsMap = new Map((hrdStatsResults || []).map((r: any) => [r.id, r]));

        // 3) 미처리(선택일 기준): 해당 날짜에 기록이 없는 수강생 수
        const hrdPendingQuery = `
            SELECT e.session_id as id, COUNT(e.id) as total_students,
                SUM(CASE WHEN al.id IS NOT NULL THEN 1 ELSE 0 END) as handled
            FROM course_session_enrollments e
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id AND al.date = ?
            WHERE e.status IN ('approved', 'enrolled', 'active')
            GROUP BY e.session_id
        `;
        const { results: hrdPendingResults } = await c.env.DB.prepare(hrdPendingQuery).bind(date).all();
        const hrdPendingMap = new Map((hrdPendingResults || []).map((r: any) => [r.id, { total: Number(r.total_students), handled: Number(r.handled) }]));
        const generalPendingQuery = `
            SELECT e.course_id as id, COUNT(e.id) as total_students,
                SUM(CASE WHEN al.id IS NOT NULL THEN 1 ELSE 0 END) as handled
            FROM enrollments e
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id AND al.date = ?
            WHERE e.status IN ('approved', 'enrolled', 'active')
            GROUP BY e.course_id
        `;
        const { results: generalPendingResults } = await c.env.DB.prepare(generalPendingQuery).bind(date).all();
        const generalPendingMap = new Map((generalPendingResults || []).map((r: any) => [r.id, { total: Number(r.total_students), handled: Number(r.handled) }]));

        const statusLabels: Record<string, string> = { recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집' };

        // 4) 결합 및 상세 데이터 구성 (출석/지각/결석 = 누적 또는 당일, 미처리 = 선택일 기준)
        const allSummaryData = (allCourses || []).map((course: any) => {
            const stats = (course.type === 'general' ? generalStatsMap.get(course.id) : hrdStatsMap.get(course.id)) || {
                total_students: 0,
                present: 0,
                late: 0,
                early: 0,
                absent: 0,
                public_leave: 0,
                absent_under_50: 0,
                late_and_early: 0
            };
            const pendingInfo = (course.type === 'general' ? generalPendingMap.get(course.id) : hrdPendingMap.get(course.id)) || { total: 0, handled: 0 };

            const totalStudents = Number(stats.total_students) || 0;
            const present = Number(stats.present) || 0;
            const late = Number(stats.late) || 0;
            const early = Number(stats.early) || 0;
            const absent = Number(stats.absent) || 0;
            const public_leave = Number(stats.public_leave) || 0;
            const absent_under_50 = Number(stats.absent_under_50) || 0;
            const late_and_early = Number(stats.late_and_early) || 0;

            const handledAbsents = absent + absent_under_50;
            const handledLates = late + early + late_and_early;
            const pending = Math.max(0, (pendingInfo.total || totalStudents) - (pendingInfo.handled ?? 0));
            const totalHandled = present + handledLates + handledAbsents + public_leave;
            const rate = totalHandled > 0 ? Math.round(((present + handledLates + public_leave) / totalHandled) * 100) : (totalStudents > 0 ? Math.round(((totalStudents - handledAbsents) / totalStudents) * 100) : 0);

            return {
                id: course.id,
                title: course.title,
                status: course.status,
                status_label: statusLabels[course.status] || course.status || '-',
                teacher_name: course.teacher_name || '-',
                total_students: totalStudents,
                present,
                late: handledLates,
                absent: handledAbsents,
                pending,
                rate,
                type: course.type
            };
        });

        // 3. 글로벌 통계 산출
        const globalStats = {
            totalCourses: total,
            totalPresent: allSummaryData.reduce((acc, c) => acc + c.present, 0),
            totalAbsent: allSummaryData.reduce((acc, c) => acc + c.absent, 0),
            avgRate: total > 0 ? Math.round(allSummaryData.reduce((acc, c) => acc + c.rate, 0) / total) : 0
        };

        // 4. 페이지네이션 적용
        const paginatedData = allSummaryData.slice(offset, offset + limit);

        return c.json({
            success: true,
            data: paginatedData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            stats: globalStats
        });
    } catch (e) {
        console.error('Failed to fetch attendance summary:', e);
        return c.json({ success: false, error: '출석 요약 조회 실패' }, 500);
    }
});

// 미처리 출석 항목 삭제 (해당 날짜·회차의 status NULL/빈값/pending 기록 삭제)
app.delete('/attendance/unprocessed', authMiddleware, async (c) => {
    try {
        const sessionId = c.req.query('sessionId');
        const date = c.req.query('date');
        if (!sessionId || !date) {
            return c.json({ success: false, error: 'sessionId와 date가 필요합니다.' }, 400);
        }
        const sid = Number(sessionId);
        if (isNaN(sid)) return c.json({ success: false, error: '유효하지 않은 sessionId입니다.' }, 400);

        const result = await c.env.DB.prepare(`
            DELETE FROM attendance_logs
            WHERE enrollment_id IN (SELECT id FROM course_session_enrollments WHERE session_id = ?)
            AND date = ?
            AND (status IS NULL OR status = '' OR status = 'pending')
        `).bind(sid, date).run();
        const deleted = result.meta.changes ?? 0;
        return c.json({ success: true, deleted });
    } catch (e: any) {
        console.error('Failed to delete unprocessed attendance:', e);
        return c.json({ success: false, error: e.message || '미처리 항목 삭제 실패' }, 500);
    }
});

// 훈련생 출결사항 출력용: 회차 정보 + 훈련일정 + 수강생 + 출결 데이터
app.get('/attendance/print-form', async (c) => {
    try {
        const sessionId = c.req.query('sessionId');
        if (!sessionId) {
            return c.json({ success: false, error: 'sessionId가 필요합니다.' }, 400);
        }

        const DB = c.env.DB;

        // 1. 회차 정보 (과정명, 기간, 강사, 시간, 강의실)
        const sessionRow = await DB.prepare(`
            SELECT s.id, s.session_number, s.session_name, s.training_start_date, s.training_end_date,
                s.instructor_name, s.training_time_start, s.training_time_end, s.location as session_location,
                a.name as course_name
            FROM course_sessions s
            JOIN approved_courses a ON s.approved_course_id = a.id
            WHERE s.id = ?
                `).bind(sessionId).first() as any;

        if (!sessionRow) {
            return c.json({ success: false, error: '회차를 찾을 수 없습니다.' }, 404);
        }

        const courseTitle = (sessionRow.course_name || '') + (sessionRow.session_number != null ? ` + ${sessionRow.session_number} 차` : '') + (sessionRow.session_name ? ' ' + sessionRow.session_name : '');
        const trainingPeriod = [sessionRow.training_start_date, sessionRow.training_end_date].filter(Boolean).map((d: string) => d.replace(/-/g, '.')).join('~');
        const trainingTime = [sessionRow.training_time_start, sessionRow.training_time_end].filter(Boolean).join('~').replace(/:00$/, '');

        // 강의실: session_timetable 첫 행의 location 또는 회차 location
        let classroom = sessionRow.session_location || '';
        if (!classroom) {
            const locRow = await DB.prepare('SELECT location FROM session_timetable WHERE session_id = ? AND location IS NOT NULL AND TRIM(location) != "" LIMIT 1').bind(sessionId).first() as any;
            classroom = locRow?.location || '제1강의실';
        }

        const instructors = (sessionRow.instructor_name || '').split(/[,/]/).map((n: string) => n.trim()).filter(Boolean).join('/') || '-';

        const settingRow = await DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind('institution_name').first() as any;
        const institutionName = settingRow?.value || '와우쓰리디(WOW3D) 홍대센터';

        const info = {
            institution: institutionName,
            courseTitle,
            classroom,
            trainingTime: trainingTime || '-',
            instructors,
            trainingPeriod: trainingPeriod || '-',
        };

        // 2. 훈련일(일차) 목록: session_timetable의 distinct training_date, 없으면 start~end 평일
        let trainingDays: { dayNumber: number; date: string; dateShort: string; dayOfWeek: string }[] = [];
        const dayRows = await DB.prepare(`
            SELECT DISTINCT training_date FROM session_timetable WHERE session_id = ? AND(is_excluded IS NULL OR is_excluded = 0) ORDER BY training_date
        `).bind(sessionId).all();

        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        if (dayRows.results && (dayRows.results as any[]).length > 0) {
            trainingDays = (dayRows.results as any[]).map((r: any, i: number) => {
                const d = r.training_date;
                const [y, m, day] = d.split('-');
                const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
                return {
                    dayNumber: i + 1,
                    date: d,
                    dateShort: `${parseInt(m)}/${parseInt(day)}`,
                    dayOfWeek: dayNames[dateObj.getDay()],
                };
            });
        } else {
            const start = sessionRow.training_start_date ? new Date(sessionRow.training_start_date) : null;
            const end = sessionRow.training_end_date ? new Date(sessionRow.training_end_date) : null;
            if (start && end) {
                let n = 0;
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const day = d.getDay();
                    if (day !== 0 && day !== 6) {
                        n++;
                        const y = d.getFullYear(), m = d.getMonth() + 1, dayNum = d.getDate();
                        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        trainingDays.push({
                            dayNumber: n,
                            date: dateStr,
                            dateShort: `${m}/${dayNum}`,
                            dayOfWeek: dayNames[day],
                        });
                    }
                }
            }
        }

        // 3. 수강생 (배정된 학생)
        const studentsRows = await DB.prepare(`
            SELECT e.id as enrollment_id, u.id as user_id, u.name, u.phone
            FROM course_session_enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.session_id = ? AND e.status IN ('approved', 'enrolled')
            ORDER BY u.name ASC
        `).bind(sessionId).all();

        const students = (studentsRows.results || []).map((s: any, i: number) => ({
            no: i + 1,
            enrollment_id: s.enrollment_id,
            name: s.name || '-',
            phone: (s.phone || '').replace(/-/g, '-') || '-',
            classification: '훈련생', // 구분: DB에 없으면 기본값
        }));

        const enrollmentIds = students.map((s: any) => s.enrollment_id);
        const dates = trainingDays.map(t => t.date);
        let attendance: any[] = [];

        if (enrollmentIds.length > 0 && dates.length > 0) {
            const placeholders = enrollmentIds.map(() => '?').join(',');
            const datePlaceholders = dates.map(() => '?').join(',');

            const logsRows = await DB.prepare(`
                SELECT enrollment_id, date, status, check_in_time
                FROM attendance_logs
                WHERE enrollment_id IN (${placeholders}) AND date IN (${datePlaceholders})
            `).bind(...enrollmentIds, ...dates).all();

            attendance = (logsRows.results || []).map((l: any) => ({
                enrollment_id: l.enrollment_id,
                date: l.date,
                status: l.status,
                check_in_time: l.check_in_time,
            }));
        }

        return c.json({
            success: true,
            data: {
                info,
                trainingDays,
                students,
                attendance,
            },
        });
    } catch (e) {
        console.error('Print-form attendance error:', e);
        return c.json({ success: false, error: '출결사항 출력 데이터 조회 실패' }, 500);
    }
});

// 월간 출석부 조회 (출력용). courseId + type=hrd 이면 회차(session) 기준으로 조회
app.get('/attendance/monthly', async (c) => {
    try {
        const courseId = c.req.query('courseId');
        const year = c.req.query('year');
        const month = c.req.query('month'); // 1-12
        const type = (c.req.query('type') || '').trim().toLowerCase();

        if (!courseId || !year || !month) {
            return c.json({ success: false, error: '필수 정보가 누락되었습니다.' }, 400);
        }

        const dateStr = `${year}-${month.toString().padStart(2, '0')}`; // YYYY-MM
        const isHrd = type === 'hrd';

        let students: any[];
        let logs: any[];

        if (isHrd) {
            // HRD 회차: course_session_enrollments + attendance_logs (배정된 학생 포함: approved, enrolled)
            const studentsRes = await c.env.DB.prepare(`
                SELECT u.id, u.name, u.phone, e.id as enrollment_id
                FROM course_session_enrollments e
                JOIN users u ON e.user_id = u.id
                WHERE e.session_id = ? AND e.status IN ('approved', 'enrolled')
                ORDER BY u.name ASC
            `).bind(courseId).all();
            students = studentsRes.results || [];

            const logsRes = await c.env.DB.prepare(`
                SELECT al.enrollment_id, al.date, al.status
                FROM attendance_logs al
                WHERE al.enrollment_id IN (SELECT id FROM course_session_enrollments WHERE session_id = ?)
                AND strftime('%Y-%m', al.date) = ?
            `).bind(courseId, dateStr).all();
            logs = logsRes.results || [];
        } else {
            // legacy: enrollments + attendance_logs
            const studentsRes = await c.env.DB.prepare(`
                SELECT u.id, u.name, u.phone, e.id as enrollment_id
                FROM users u
                JOIN enrollments e ON u.id = e.user_id
                WHERE e.course_id = ? AND u.role = 'student'
                ORDER BY u.name ASC
            `).bind(courseId).all();
            students = studentsRes.results || [];

            const logsRes = await c.env.DB.prepare(`
                SELECT al.enrollment_id, al.date, al.status
                FROM attendance_logs al
                JOIN enrollments e ON al.enrollment_id = e.id
                WHERE e.course_id = ? AND strftime('%Y-%m', al.date) = ?
            `).bind(courseId, dateStr).all();
            logs = logsRes.results || [];
        }

        // 3. 데이터 병합
        const data = students.map((s: any) => {
            const studentLogs = logs.filter((l: any) => l.enrollment_id === s.enrollment_id);
            // 날짜별 상태 맵 생성
            const attendanceMap: Record<number, string> = {};
            studentLogs.forEach(l => {
                const day = parseInt(l.date.split('-')[2]);
                attendanceMap[day] = l.status;
            });
            return {
                id: s.id,
                name: s.name,
                phone: s.phone,
                attendance: attendanceMap
            };
        });

        return c.json({ success: true, data });
    } catch (e) {
        console.error('Failed to fetch monthly attendance:', e);
        return c.json({ success: false, error: '월간 출석부 조회 실패' }, 500);
    }
});

// 출석 기록 저장 (일괄 처리)
app.post('/attendance', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const body = await c.req.json();
        const { courseId, date, attendances } = body;

        if (!courseId || !date || !attendances) {
            return c.json({ success: false, error: '필수 정보가 누락되었습니다.' }, 400);
        }

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(courseId).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        // 각 학생별로 처리 (D1 배치가 제한적이므로 반복문 사용하되, 최적화 고려)
        // enrollment_id 조회가 필요하므로 쿼리가 복잡해짐.
        // 프론트에서 user_id(studentId)를 보내주므로, 이를 통해 enrollment_id를 찾아야 함.

        for (const att of attendances) {
            // 1. Enrollment ID 조회
            const enrollment = await c.env.DB.prepare(
                "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?"
            ).bind(att.studentId, courseId).first();

            if (!enrollment) continue; // 수강 등록이 안된 학생은 무시

            const enrollmentId = enrollment.id;

            // 2. 기존 기록 확인
            const existingLog: any = await c.env.DB.prepare(
                "SELECT id FROM attendance_logs WHERE enrollment_id = ? AND date = ?"
            ).bind(enrollmentId, date).first();

            if (existingLog) {
                // 업데이트
                await c.env.DB.prepare(`
                    UPDATE attendance_logs 
                    SET status = ?, check_in_time = ?, check_out_time = ?, note = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(att.status, att.inTime, att.outTime, att.memo, existingLog.id).run();
            } else {
                // 신규 등록
                await c.env.DB.prepare(`
                    INSERT INTO attendance_logs (enrollment_id, date, status, check_in_time, check_out_time, note)
                    VALUES (?, ?, ?, ?, ?, ?)
                `).bind(enrollmentId, date, att.status, att.inTime, att.outTime, att.memo).run();
            }
        }

        return c.json({ success: true });
    } catch (e) {
        console.error('Failed to save attendance:', e);
        return c.json({ success: false, error: '출석 저장 실패' }, 500);
    }
});

// 대시보드 통계 조회 (기존 코드 유지)
app.get('/stats', async (c) => {
    try {
        const studentCountResult = await c.env.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").first();
        const studentCount = studentCountResult ? (studentCountResult as any).count : 0;

        // 운영 중인 과정 수 (일반 과정 + HRD 회차 통합)
        const coursesCountResult = await c.env.DB.prepare(`
            SELECT (
                SELECT COUNT(*) FROM courses WHERE status IN ('active', 'open', 'in_progress')
            ) + (
                SELECT COUNT(*) FROM course_sessions WHERE status IN ('active', 'open', 'in_progress', 'recruiting')
            ) as count
        `).first();
        const activeCourseCount = coursesCountResult ? (coursesCountResult as any).count : 0;

        const itemCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM hrd_items").first('count');
        const facilityCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM hrd_facilities").first('count');

        return c.json({
            success: true,
            data: {
                students: studentCount || 0,
                activeCourses: activeCourseCount || 0,
                items: itemCount || 0,
                facilities: facilityCount || 0,
                attendanceRate: await (async () => {
                    // 전체 출석 기록 수
                    const totalLogs: any = await c.env.DB.prepare("SELECT COUNT(*) as count FROM attendance_logs").first();
                    if (!totalLogs || totalLogs.count === 0) return 0;

                    // 결석(absent, absent_under_50)이 아닌 모든 상태를 출석으로 인정 (통일 로직)
                    const attendedLogs: any = await c.env.DB.prepare(
                        "SELECT COUNT(*) as count FROM attendance_logs WHERE status NOT IN ('absent', 'absent_under_50')"
                    ).first();

                    const rate = (attendedLogs.count / totalLogs.count) * 100;
                    return Math.round(rate * 10) / 10; // 소수점 첫째 자리까지 반올림
                })(),
                notifications: 3
            }
        });
    } catch (e) {
        console.error('Failed to fetch stats:', e);
        return c.json({ success: false, error: '통계 조회 실패' }, 500);
    }
});

// ==========================================
// 훈련생 상담 관리 API
// ==========================================

// GET /api/hrd/counseling - 상담 일지 목록 조회 (session_id: 회차별 담당학생 상담이력 연동)
app.get('/counseling', async (c) => {
    try {
        const studentId = c.req.query('student_id');
        const courseId = c.req.query('course_id');
        const sessionId = c.req.query('session_id'); // 회차 ID - 해당 회차 수강생 상담만 조회
        const search = c.req.query('search');
        const type = c.req.query('type'); // 'admission' or 'academic'
        const consultationId = c.req.query('consultation_id');
        const date = c.req.query('date'); // YYYY-MM-DD

        let query = `
            SELECT 
                cl.*,
                u_student.name as student_name,
                u_student.profile_image as student_image,
                u_counselor.name as counselor_name,
                c.title as course_title,
                cons.name as consultation_name
            FROM hrd_counseling_logs cl
            LEFT JOIN users u_student ON cl.student_id = u_student.id
            LEFT JOIN users u_counselor ON cl.counselor_id = u_counselor.id
            LEFT JOIN courses c ON cl.course_id = c.id
            LEFT JOIN consultations cons ON cl.consultation_id = cons.id
            WHERE 1=1
        `;

        const params: any[] = [];

        if (studentId) {
            query += ' AND cl.student_id = ?';
            params.push(studentId);
        }

        if (courseId) {
            query += ' AND cl.course_id = ?';
            params.push(courseId);
        }

        if (sessionId) {
            query += ` AND cl.student_id IN (SELECT user_id FROM course_session_enrollments WHERE session_id = ? AND status IN ('approved', 'enrolled'))`;
            params.push(sessionId);
        }

        if (search) {
            query += ' AND (u_student.name LIKE ? OR cl.content LIKE ? OR cons.name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (type) {
            query += ' AND cl.counseling_type = ?';
            params.push(type);
        }

        if (consultationId) {
            query += ' AND cl.consultation_id = ?';
            params.push(consultationId);
        }

        if (date) {
            query += ' AND date(cl.counseling_date) = ?';
            params.push(date);
        }

        query += ' ORDER BY cl.counseling_date DESC';

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/hrd/counseling - 상담 일지 등록 (로그인한 사용자를 상담자로 저장)
app.post('/counseling', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const user = c.get('user') as JWTPayload;
        const counselorId = user.userId;

        const studentId = (body.student_id && body.student_id !== 0 && body.student_id !== '0') ? body.student_id : null;

        // course_id는 courses.id FK — 강사/LMS에서 넘기는 값이 회차(session) ID일 수 있으므로, courses에 없으면 null로 저장
        let courseId = body.course_id != null ? (typeof body.course_id === 'number' ? body.course_id : parseInt(String(body.course_id), 10) || null) : null;
        if (courseId != null) {
            try {
                const row = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(courseId).first();
                if (!row) courseId = null;
            } catch (_) {
                courseId = null;
            }
        }

        await c.env.DB.prepare(`
            INSERT INTO hrd_counseling_logs (
                student_id, counselor_id, course_id, counseling_date, 
                category, method, content, result, next_counseling_date,
                counseling_type, consultation_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            studentId, counselorId, courseId,
            body.counseling_date || new Date().toISOString(),
            body.category, body.method, body.content, body.result, body.next_counseling_date,
            body.counseling_type || 'academic', body.consultation_id
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 등록되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// PUT /api/hrd/counseling/:id - 상담 일지 수정
app.put('/counseling/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const studentId = (body.student_id && body.student_id !== 0 && body.student_id !== '0') ? body.student_id : null;
        const counselorId = (body.counselor_id != null && body.counselor_id !== '' && body.counselor_id !== '0') ? body.counselor_id : null;

        let courseId = body.course_id != null ? (typeof body.course_id === 'number' ? body.course_id : parseInt(String(body.course_id), 10) || null) : null;
        if (courseId != null) {
            try {
                const row = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(courseId).first();
                if (!row) courseId = null;
            } catch (_) {
                courseId = null;
            }
        }

        await c.env.DB.prepare(`
            UPDATE hrd_counseling_logs 
            SET student_id = ?, counselor_id = ?, course_id = ?, counseling_date = ?, category = ?, method = ?, content = ?,
                result = ?, next_counseling_date = ?, counseling_type = ?, consultation_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            studentId, counselorId, courseId, body.counseling_date, body.category, body.method,
            body.content, body.result, body.next_counseling_date,
            body.counseling_type, body.consultation_id, id
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 수정되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/hrd/counseling/:id - 상담 일지 삭제
app.delete('/counseling/:id', authMiddleware, async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.DB.prepare('DELETE FROM hrd_counseling_logs WHERE id = ?').bind(id).run();
        return successResponse(c, { success: true }, '상담 일지가 삭제되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 훈련 일지 (Training Logs) API - NCS 연동
// ============================================

// 훈련 일지 목록 조회

// 훈련 일지용 일일 시간표 조회 (자동완성용, 강의 후 설문지 과목/강사 로드)
app.get('/training-logs/daily-schedule', authMiddleware, async (c) => {
    try {
        const courseId = c.req.query('courseId'); // session_id
        const date = c.req.query('date');

        if (!courseId || !date) return errorResponse(c, 'courseId and date are required', 400);

        // 시간표에서 해당 날짜의 교시별 과목, 담당강사 조회
        // session_timetable <-> ncs_approved_curriculum (subject) <-> users (instructor)
        const query = `
            SELECT 
                st.period_number,
                st.subject_id,
                c.name as subject_name,
                c.type as subject_type,
                st.instructor_id,
                u.name as instructor_name,
                st.location,
                st.is_excluded
            FROM session_timetable st
            LEFT JOIN ncs_approved_curriculum c ON st.subject_id = c.id
            LEFT JOIN users u ON st.instructor_id = u.id
            WHERE st.session_id = ? AND st.training_date = ?
            ORDER BY st.period_number ASC
        `;

        const { results } = await c.env.DB.prepare(query).bind(courseId, date).all();
        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 훈련 일지 요약 정보 조회 — 교육운영관리 회차(course_sessions) 전체 목록 + 상태 필터
app.get('/training-logs/summary', authMiddleware, async (c) => {
    try {
        const month = c.req.query('month') || new Date().toISOString().substring(0, 7); // YYYY-MM
        const statusFilter = (c.req.query('status') || 'all').toLowerCase(); // all | recruiting | in_progress | completed | closed

        let statusCondition = '';
        const params: (string | number)[] = [];
        if (statusFilter && statusFilter !== 'all') {
            if (['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
                statusCondition = ' AND s.status = ?';
                params.push(statusFilter);
            }
        }

        let sessions: any[] = [];
        try {
            const sessionsQuery = c.env.DB.prepare(`
                SELECT s.id, s.session_number, s.session_name, s.status, s.training_start_date, s.training_end_date,
                    s.instructor_name, a.name as course_name, s.lms_course_id,
                    a.total_hours as assigned_hours
                FROM course_sessions s
                JOIN approved_courses a ON s.approved_course_id = a.id
                WHERE 1=1 ${statusCondition}
                ORDER BY s.training_start_date DESC, s.id DESC
            `);
            const bound = params.length > 0 ? sessionsQuery.bind(...params) : sessionsQuery;
            const out = await bound.all();
            sessions = out?.results ?? [];
        } catch (queryErr: any) {
            console.error('[training-logs/summary] sessions query failed:', queryErr?.message || queryErr);
            return c.json({ success: true, data: [], _warning: 'course_sessions/approved_courses 조회 실패. 마이그레이션 적용 여부를 확인하세요.' });
        }

        const summaryData = await Promise.all((sessions || []).map(async (session: any) => {
            try {
                const courseName = (session.course_name || '과정').trim();
                const sessionNum = session.session_number != null ? String(session.session_number) : '';
                const sessionNamePart = session.session_name ? ' - ' + session.session_name : '';
                const title = `${courseName} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart})`.trim();
                let courseId: number | null = null;
                let resolvedByTitleOrLike = false;

                try {
                    // lms_course_id가 있어도, 제목 일치 + 다른 회차에 연결돼 있지 않을 때만 사용
                    if (session.lms_course_id != null && session.lms_course_id > 0) {
                        const linked: any = await c.env.DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(session.lms_course_id).first();
                        const titleOk = linked && linked.title != null && (
                            String(linked.title).trim() === title ||
                            String(linked.title).trim() === `${courseName} (${sessionNum}회차)`.trim()
                        );
                        const otherSession: any = await c.env.DB.prepare(
                            'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                        ).bind(session.lms_course_id, session.id).first();
                        if (titleOk && !otherSession) courseId = Number(session.lms_course_id);
                        else if (linked || otherSession) {
                            try {
                                await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, session.id).run();
                            } catch (_) { }
                        }
                    }
                    // 훈련일지: 회차별 별도 LMS 과정(1:1) — 과정명 풀네임으로만 매칭, LIKE 미사용
                    const rejectIfUsedByOtherSession = async (cid: number) => {
                        const other: any = await c.env.DB.prepare(
                            'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                        ).bind(cid, session.id).first();
                        return other ? null : cid;
                    };
                    if (courseId == null) {
                        const exact: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? LIMIT 1').bind(title).first();
                        courseId = exact?.id != null ? await rejectIfUsedByOtherSession(exact.id) : null;
                        if (courseId != null) resolvedByTitleOrLike = true;
                    }
                    if (courseId == null) {
                        const lmsCourse: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(title).first();
                        courseId = lmsCourse?.id != null ? await rejectIfUsedByOtherSession(lmsCourse.id) : null;
                        if (courseId != null) resolvedByTitleOrLike = true;
                    }
                    if (courseId != null && resolvedByTitleOrLike) {
                        try {
                            await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(courseId, session.id).run();
                        } catch (_) {
                            // lms_course_id 컬럼 없거나 권한 등으로 실패해도 계속 진행
                        }
                    }
                } catch (_) {
                    // courses 조회 실패 시 courseId는 기존 값 유지
                }

                let log_count = 0, logged_hours = 0, last_log_date: string | null = null, ncs_rate = 0;
                if (courseId) {
                    try {
                        const logStats: any = await c.env.DB.prepare(`
                            SELECT COUNT(*) as log_count, COALESCE(SUM(training_hours), 0) as total_hours, MAX(date) as last_log_date
                            FROM training_logs WHERE course_id = ?
                        `).bind(courseId).first();
                        log_count = logStats?.log_count ?? 0;
                        logged_hours = logStats?.total_hours ?? 0;
                        last_log_date = logStats?.last_log_date ?? null;
                    } catch (_) {
                        // training_logs 조회 실패 시 0 유지
                    }
                    try {
                        const ncsStats: any = await c.env.DB.prepare(`
                            SELECT COALESCE(SUM(cnu.training_hours), 0) as target_total,
                                (SELECT COALESCE(SUM(training_hours), 0) FROM training_logs WHERE course_id = ?) as current_total
                            FROM course_ncs_units cnu WHERE cnu.course_id = ?
                        `).bind(courseId, courseId).first();
                        const target = ncsStats?.target_total ?? 0;
                        const current = ncsStats?.current_total ?? 0;
                        ncs_rate = target > 0 ? Math.round((current / target) * 100) : 0;
                    } catch (_) {
                        // course_ncs_units 없거나 조회 실패 시 0 유지
                    }
                }

                const statusLabel = { recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집' }[session.status] || session.status;
                const assigned_hours = session.assigned_hours != null ? Number(session.assigned_hours) : 0;

                return {
                    id: session.id,
                    title,
                    status: session.status,
                    status_label: statusLabel,
                    teacher_name: session.instructor_name || null,
                    log_count,
                    total_hours: assigned_hours,
                    logged_hours,
                    last_log_date,
                    ncs_rate,
                    training_start_date: session.training_start_date,
                    training_end_date: session.training_end_date,
                    lms_course_id: courseId
                };
            } catch (rowErr: any) {
                console.error('[training-logs/summary] row error session.id=' + session?.id, rowErr?.message || rowErr);
                const assigned_hours = session?.assigned_hours != null ? Number(session.assigned_hours) : 0;
                return {
                    id: session?.id,
                    title: (session?.course_name || '과정') + ' (오류)',
                    status: session?.status,
                    status_label: session?.status || '-',
                    teacher_name: session?.instructor_name || null,
                    log_count: 0,
                    total_hours: assigned_hours,
                    logged_hours: 0,
                    last_log_date: null,
                    ncs_rate: 0,
                    training_start_date: session?.training_start_date,
                    training_end_date: session?.training_end_date,
                    lms_course_id: null
                };
            }
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('[training-logs/summary]', e?.message || e);
        return errorResponse(c, e?.message || '훈련일지 요약 조회 실패', 500);
    }
});

// 훈련 일지 목록 조회 (courseId는 courses.id 또는 course_sessions.id 가능)
app.get('/training-logs', async (c) => {
    try {
        const courseIdParam = c.req.query('courseId');
        const startDate = c.req.query('startDate');
        const endDate = c.req.query('endDate');

        const page = parseInt(c.req.query('page') || '1', 10);
        let limit = parseInt(c.req.query('limit') || '10', 10);
        if (limit === 0) limit = 1000;
        const offset = (page - 1) * limit;

        if (!courseIdParam) {
            return c.json({ success: true, data: [] });
        }
        const rawId = Number(courseIdParam);
        if (isNaN(rawId)) {
            return c.json({ success: true, data: [] });
        }

        let resolvedCourseId: number | null = null;

        let assignedDailyHours: number | null = null;

        // 1. 회차(session) 우선: URL이 회차 ID이면 해당 회차 전용 LMS 과정으로 해석 (복사로 만든 신규 회차가 다른 회차 일지를 보는 문제 방지)
        const sessionRow: any = await c.env.DB.prepare(`
            SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name, a.daily_hours, a.total_hours, a.total_days
            FROM course_sessions s
            JOIN approved_courses a ON s.approved_course_id = a.id
            WHERE s.id = ?
        `).bind(rawId).first();

        if (sessionRow) {
            const session = sessionRow;
            if (session.daily_hours != null && session.daily_hours > 0) {
                assignedDailyHours = Number(session.daily_hours);
            }
            if (assignedDailyHours == null && session.total_hours != null && session.total_days != null && Number(session.total_days) > 0) {
                const th = Number(session.total_hours);
                const td = Number(session.total_days);
                if (th > 0) assignedDailyHours = Math.round((th / td) * 10) / 10;
            }
            const expectedTitle = `${session.course_name || '과정'} (${session.session_number}회차${session.session_name ? ' - ' + session.session_name : ''})`.trim();
            // 이미 연결된 LMS 과정이 있으면, 제목 일치 + 다른 회차에 연결돼 있지 않을 때만 사용
            if (session.lms_course_id != null && session.lms_course_id > 0) {
                const existingCourse: any = await c.env.DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(session.lms_course_id).first();
                const titleMatches = existingCourse && existingCourse.title != null && (
                    String(existingCourse.title).trim() === expectedTitle ||
                    String(existingCourse.title).trim() === `${session.course_name || '과정'} (${session.session_number}회차)`.trim()
                );
                const otherSession: any = await c.env.DB.prepare(
                    'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                ).bind(session.lms_course_id, rawId).first();
                const notUsedByOther = !otherSession;
                if (titleMatches && notUsedByOther) {
                    resolvedCourseId = Number(session.lms_course_id);
                } else if (existingCourse || otherSession) {
                    try {
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, rawId).run();
                    } catch (_) { }
                }
            }
            if (resolvedCourseId == null) {
                const lmsCourse: any = await c.env.DB.prepare(
                    'SELECT id FROM courses WHERE title = ? LIMIT 1'
                ).bind(expectedTitle).first();

                if (lmsCourse) {
                    // 이 과정이 이미 다른 회차에 연결돼 있으면 사용하지 않음 (회차 12에 회차 4 일지가 보이는 문제 방지)
                    const otherSession: any = await c.env.DB.prepare(
                        'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                    ).bind(lmsCourse.id, rawId).first();
                    if (!otherSession) {
                        resolvedCourseId = lmsCourse.id;
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
                    }
                }
            }
            // 여전히 없으면: 이 회차 전용 LMS 과정을 새로 만들어서 1:1 연결 (과정 4에서 등록한 일지가 과정 12에 안 보이게)
            if (resolvedCourseId == null) {
                try {
                    const insert = await c.env.DB.prepare(
                        'INSERT INTO courses (title, category, status) VALUES (?, \'국비지원\', \'active\')'
                    ).bind(expectedTitle).run();
                    const newId = insert.meta?.last_row_id;
                    if (newId != null) {
                        resolvedCourseId = Number(newId);
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
                    }
                } catch (_) { }
            }
        } else {
            // 2. 회차가 아니면 courses.id로 해석 (직접 과정 ID로 들어온 경우)
            const existsInCourses = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
            if (existsInCourses) {
                resolvedCourseId = rawId;
                const sessionWithCourse: any = await c.env.DB.prepare(`
                    SELECT a.daily_hours FROM course_sessions s
                    JOIN approved_courses a ON s.approved_course_id = a.id
                    WHERE s.lms_course_id = ?
                    LIMIT 1
                `).bind(rawId).first();
                if (sessionWithCourse && sessionWithCourse.daily_hours != null && sessionWithCourse.daily_hours > 0) {
                    assignedDailyHours = Number(sessionWithCourse.daily_hours);
                }
            }
        }

        if (resolvedCourseId == null) {
            return c.json({ success: true, data: [], assignedDailyHours: assignedDailyHours ?? undefined });
        }

        let countQuery = "SELECT COUNT(*) as total FROM training_logs t WHERE t.course_id = ?";
        const countParams: any[] = [resolvedCourseId];
        if (startDate && endDate) {
            countQuery += " AND t.date BETWEEN ? AND ?";
            countParams.push(startDate, endDate);
        }

        const countRow: any = await c.env.DB.prepare(countQuery).bind(...countParams).first();
        const total = countRow?.total || 0;

        let query = `
            SELECT t.*, u.name as ncs_unit_name, u.code as ncs_unit_code, usr.name as instructor_name
            FROM training_logs t
            LEFT JOIN ncs_units u ON t.ncs_unit_id = u.id
            LEFT JOIN users usr ON t.instructor_id = usr.id
            WHERE t.course_id = ?
        `;
        const params: any[] = [resolvedCourseId];

        if (startDate && endDate) {
            query += " AND t.date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        }

        query += " ORDER BY t.date DESC LIMIT ? OFFSET ?";
        params.push(limit, offset);

        const { results } = await c.env.DB.prepare(query).bind(...params).all();

        const out: { success: boolean; data: any; pagination?: any; assignedDailyHours?: number } = {
            success: true,
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
        if (assignedDailyHours != null) out.assignedDailyHours = assignedDailyHours;
        return c.json(out);
    } catch (e: any) {
        console.error('[Training Logs GET] Error:', e);
        return errorResponse(c, '훈련일지 조회 실패: ' + e.message, 500);
    }
});

// 훈련일지 회차 연동 해제: 이 회차 전용 LMS 과정을 만들어서 다른 과정과 일지가 겹치지 않게 함 (관리자 한 번 호출)
app.post('/training-logs/ensure-dedicated-course', authMiddleware, async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const courseIdParam = c.req.query('courseId') ?? body.courseId;
        if (courseIdParam == null || courseIdParam === '') {
            return errorResponse(c, 'courseId가 필요합니다.', 400);
        }
        const rawId = Number(courseIdParam);
        if (isNaN(rawId)) {
            return errorResponse(c, '유효한 courseId를 입력해 주세요.', 400);
        }

        const existsInCourses = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
        if (existsInCourses) {
            return c.json({ success: true, message: '이미 LMS 과정 ID입니다. 연동 해제가 필요하지 않습니다.', resolvedCourseId: rawId });
        }

        const session: any = await c.env.DB.prepare(`
            SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
            FROM course_sessions s
            JOIN approved_courses a ON s.approved_course_id = a.id
            WHERE s.id = ?
        `).bind(rawId).first();

        if (!session) {
            return errorResponse(c, '해당 회차를 찾을 수 없습니다.', 404);
        }

        const expectedTitle = `${session.course_name || '과정'} (${session.session_number}회차${session.session_name ? ' - ' + session.session_name : ''})`.trim();
        let resolvedCourseId: number | null = null;

        const otherSession: any = session.lms_course_id != null
            ? await c.env.DB.prepare('SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1')
                .bind(session.lms_course_id, rawId).first()
            : null;

        if (otherSession) {
            await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, rawId).run();
        }

        const lmsCourse: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(expectedTitle).first();
        if (lmsCourse) {
            const usedByOther: any = await c.env.DB.prepare(
                'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
            ).bind(lmsCourse.id, rawId).first();
            if (!usedByOther) {
                resolvedCourseId = lmsCourse.id;
                await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
            }
        }

        if (resolvedCourseId == null) {
            const insert = await c.env.DB.prepare(
                'INSERT INTO courses (title, category, status) VALUES (?, \'국비지원\', \'active\')'
            ).bind(expectedTitle).run();
            const newId = insert.meta?.last_row_id;
            if (newId != null) {
                resolvedCourseId = Number(newId);
                await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
            }
        }

        if (resolvedCourseId == null) {
            return errorResponse(c, '전용 과정 생성에 실패했습니다.', 500);
        }
        return c.json({
            success: true,
            message: '이 회차 전용 LMS 과정으로 연동되었습니다. 페이지를 새로고침하면 해당 회차 일지만 보입니다.',
            resolvedCourseId
        });
    } catch (e: any) {
        console.error('[ensure-dedicated-course]', e);
        return errorResponse(c, '연동 해제 실패: ' + (e?.message || String(e)), 500);
    }
});

// 지정된 훈련일 목록 조회 (모달에서 훈련일을 리스트로만 선택하기 위함)
app.get('/training-logs/training-dates', authMiddleware, async (c) => {
    try {
        const courseIdParam = c.req.query('courseId');
        if (!courseIdParam) return errorResponse(c, 'courseId가 필요합니다.', 400);
        const rawId = Number(courseIdParam);
        if (isNaN(rawId)) return errorResponse(c, '유효한 courseId를 입력해 주세요.', 400);

        const session: any = await c.env.DB.prepare(`
            SELECT s.id, s.status, s.training_start_date, s.training_end_date
            FROM course_sessions s
            WHERE s.id = ?
        `).bind(rawId).first();
        if (!session) return errorResponse(c, '회차를 찾을 수 없습니다.', 404);

        const today = new Date().toISOString().substring(0, 10);
        const isClosed = ['completed', 'closed'].includes(String(session.status)) ||
            (session.training_end_date && String(session.training_end_date).substring(0, 10) < today);

        const timetableRows: any = await c.env.DB.prepare(`
            SELECT DISTINCT training_date FROM session_timetable
            WHERE session_id = ? AND (is_excluded IS NULL OR is_excluded = 0)
            ORDER BY training_date ASC
        `).bind(rawId).all();
        const datesFromTimetable = (timetableRows.results || []).map((r: any) => String(r.training_date || '').substring(0, 10)).filter(Boolean);

        let dates: string[];
        if (datesFromTimetable.length > 0) {
            dates = datesFromTimetable;
        } else {
            const start = (session.training_start_date || '').toString().substring(0, 10);
            const end = (session.training_end_date || '').toString().substring(0, 10);
            if (!start || !end) {
                dates = [];
            } else {
                dates = [];
                const d = new Date(start);
                const endD = new Date(end);
                while (d <= endD) {
                    dates.push(d.toISOString().substring(0, 10));
                    d.setDate(d.getDate() + 1);
                }
            }
        }

        return c.json({
            success: true,
            data: {
                dates,
                training_start_date: session.training_start_date,
                training_end_date: session.training_end_date,
                status: session.status,
                is_closed: isClosed
            }
        });
    } catch (e: any) {
        console.error('[training-dates]', e);
        return errorResponse(c, e?.message || '훈련일 목록 조회 실패', 500);
    }
});

// 훈련 일지 상세 조회
app.get('/training-logs/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const result = await c.env.DB.prepare(`
            SELECT t.*, u.name as ncs_unit_name, u.code as ncs_unit_code, usr.name as instructor_name
            FROM training_logs t
            LEFT JOIN ncs_units u ON t.ncs_unit_id = u.id
            LEFT JOIN users usr ON t.instructor_id = usr.id
            WHERE t.id = ?
        `).bind(id).first();
        return c.json({ success: true, data: result });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 훈련 일지 등록/수정
app.post('/training-logs', async (c) => {
    try {
        const body = await c.req.json();
        console.log('[Training Log Save] Request body:', JSON.stringify(body));

        const { id, course_id, instructor_id, date, topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json, schedule_details_json } = body;

        // Validate required fields
        if (!course_id) {
            return errorResponse(c, '과정 ID가 필요합니다.', 400);
        }
        if (!date) {
            return errorResponse(c, '훈련 날짜가 필요합니다.', 400);
        }

        const safeTopic = (topic && topic.trim() !== '') ? topic.trim() : '-';

        let { attendance_summary_json } = body;
        if (attendance_summary_json === undefined) attendance_summary_json = null;

        if (id) {
            // 수정 (instructor_id 포함 — 배정 해제 시 null 가능)
            const safeNcsUnitId = (ncs_unit_id === '' || ncs_unit_id === 0 || ncs_unit_id === '0') ? null : ncs_unit_id;

            const updates: string[] = ['topic = ?', 'content = ?', 'teaching_method = ?', 'ncs_unit_id = ?', 'training_hours = ?', 'ncs_elements_json = ?', 'schedule_details_json = ?', 'attendance_summary_json = ?', 'updated_at = CURRENT_TIMESTAMP'];
            const bindParams: any[] = [safeTopic, content || '', teaching_method || '주입식/실습', safeNcsUnitId, training_hours || 0, ncs_elements_json || null, schedule_details_json || null, attendance_summary_json];

            if (body.instructor_id !== undefined) {
                updates.push('instructor_id = ?');
                const safeUpdateInstructorId = (body.instructor_id === '' || body.instructor_id === null || body.instructor_id === 0 || body.instructor_id === '0') ? null : body.instructor_id;
                bindParams.push(safeUpdateInstructorId);
            }
            bindParams.push(id); // Where clause param

            // Execute Update
            console.log('[Training Log Update] Query:', `UPDATE training_logs SET ${updates.join(', ')} WHERE id = ?`);
            console.log('[Training Log Update] Params:', bindParams);

            await c.env.DB.prepare(`
                UPDATE training_logs SET ${updates.join(', ')} WHERE id = ?
            `).bind(...bindParams).run();

        } else {
            // 등록: course_id가 회차(course_sessions.id)일 수 있으므로 courses.id로 해석
            const rawId = course_id == null ? null : Number(course_id);
            if (rawId == null || isNaN(rawId)) {
                return errorResponse(c, '과정(회차)을 선택해 주세요.', 400);
            }

            let resolvedCourseId: number | null = null;
            let resolvedViaSession = false;

            try {
                const existsInCourses = await c.env.DB.prepare('SELECT id FROM courses WHERE id = ?').bind(rawId).first();
                if (existsInCourses) {
                    resolvedCourseId = rawId;
                } else {
                    resolvedViaSession = true;
                    const session: any = await c.env.DB.prepare(`
                        SELECT s.id, s.session_number, s.session_name, s.lms_course_id, a.name as course_name
                        FROM course_sessions s
                        JOIN approved_courses a ON s.approved_course_id = a.id
                        WHERE s.id = ?
                    `).bind(rawId).first();

                    if (session) {
                        const expectedTitle = `${session.course_name || '과정'} (${session.session_number}회차${session.session_name ? ' - ' + session.session_name : ''})`.trim();
                        // 이미 연결된 LMS 과정이 있으면, 제목 일치 + 다른 회차에 연결돼 있지 않을 때만 사용
                        if (session.lms_course_id != null && session.lms_course_id > 0) {
                            const existingCourse: any = await c.env.DB.prepare('SELECT id, title FROM courses WHERE id = ?').bind(session.lms_course_id).first();
                            const titleOk = existingCourse && existingCourse.title != null && (
                                String(existingCourse.title).trim() === expectedTitle ||
                                String(existingCourse.title).trim() === `${session.course_name || '과정'} (${session.session_number}회차)`.trim()
                            );
                            const otherSession: any = await c.env.DB.prepare(
                                'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                            ).bind(session.lms_course_id, rawId).first();
                            if (titleOk && !otherSession) resolvedCourseId = Number(session.lms_course_id);
                            else if (existingCourse || otherSession) {
                                try {
                                    await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(null, rawId).run();
                                } catch (_) { }
                            }
                        }
                        if (resolvedCourseId == null) {
                            const existingCourse: any = await c.env.DB.prepare(
                                'SELECT id FROM courses WHERE title = ? LIMIT 1'
                            ).bind(expectedTitle).first();

                            const usedByOther: any = existingCourse ? await c.env.DB.prepare(
                                'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                            ).bind(existingCourse.id, rawId).first() : null;

                            if (existingCourse && !usedByOther) {
                                resolvedCourseId = existingCourse.id;
                                console.log('[Training Log] Using existing LMS course:', resolvedCourseId, expectedTitle);
                            } else {
                                const insert = await c.env.DB.prepare(`
                                    INSERT INTO courses (title, category, status) VALUES (?, '국비지원', 'active')
                                `).bind(expectedTitle).run();
                                const newCourseId = insert.meta?.last_row_id;
                                if (newCourseId == null) {
                                    return errorResponse(c, 'LMS 과정 생성에 실패했습니다.', 500);
                                }
                                resolvedCourseId = Number(newCourseId);
                                console.log('[Training Log] Created new LMS course:', resolvedCourseId, expectedTitle);
                            }
                            await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
                        }
                    }
                }
            } catch (queryErr) {
                console.error('[Training Log] Error resolving course ID:', queryErr);
                return errorResponse(c, '과정 정보 조회 중 오류가 발생했습니다: ' + (queryErr instanceof Error ? queryErr.message : String(queryErr)), 500);
            }

            if (resolvedCourseId == null) {
                return errorResponse(c, '선택한 과정(회차)을 찾을 수 없습니다. 유효한 과정 또는 회차를 선택해 주세요.', 400);
            }

            // 등록 직전 한 번 더: 이 과정이 다른 회차에 연결돼 있으면 사용 금지 → 이 회차 전용 과정 새로 생성 (회차 4 일지가 회차 12에 보이는 문제 방지)
            if (resolvedViaSession) {
                const other: any = await c.env.DB.prepare(
                    'SELECT id FROM course_sessions WHERE lms_course_id = ? AND id != ? LIMIT 1'
                ).bind(resolvedCourseId, rawId).first();
                if (other) {
                    const session: any = await c.env.DB.prepare(`
                        SELECT s.session_number, s.session_name, a.name as course_name
                        FROM course_sessions s
                        JOIN approved_courses a ON s.approved_course_id = a.id
                        WHERE s.id = ?
                    `).bind(rawId).first();
                    const expectedTitle = `${session?.course_name || '과정'} (${session?.session_number}회차${session?.session_name ? ' - ' + session.session_name : ''})`.trim();
                    const insert = await c.env.DB.prepare(
                        `INSERT INTO courses (title, category, status) VALUES (?, '국비지원', 'active')`
                    ).bind(expectedTitle).run();
                    const newId = insert.meta?.last_row_id;
                    if (newId != null) {
                        resolvedCourseId = Number(newId);
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(resolvedCourseId, rawId).run();
                    }
                }
            }

            const safeInstructorId = (instructor_id === '' || instructor_id === 0 || instructor_id === '0') ? null : instructor_id;
            const safeNcsUnitId = (ncs_unit_id === '' || ncs_unit_id === 0 || ncs_unit_id === '0') ? null : ncs_unit_id;

            // 중복 방지: 같은 과정·같은 날짜 일지가 이미 있으면 INSERT 대신 UPDATE
            const existingByDate = await c.env.DB.prepare(
                'SELECT id FROM training_logs WHERE course_id = ? AND date = ? LIMIT 1'
            ).bind(resolvedCourseId, date).first();
            const existingId = existingByDate && (existingByDate as { id?: number }).id ? (existingByDate as { id: number }).id : null;

            if (existingId) {
                console.log('[Training Log Upsert] Existing log for same course+date, updating id:', existingId);
                const updates: string[] = ['topic = ?', 'content = ?', 'teaching_method = ?', 'ncs_unit_id = ?', 'training_hours = ?', 'ncs_elements_json = ?', 'schedule_details_json = ?', 'attendance_summary_json = ?', 'updated_at = CURRENT_TIMESTAMP'];
                const bindParams: any[] = [safeTopic, content || '', teaching_method || '주입식/실습', safeNcsUnitId, training_hours || 0, ncs_elements_json || null, schedule_details_json || null, attendance_summary_json];
                if (body.instructor_id !== undefined) {
                    updates.push('instructor_id = ?');
                    const safeUpdateInstructorId = (body.instructor_id === '' || body.instructor_id === null || body.instructor_id === 0 || body.instructor_id === '0') ? null : body.instructor_id;
                    bindParams.push(safeUpdateInstructorId);
                }
                bindParams.push(existingId);
                await c.env.DB.prepare(`UPDATE training_logs SET ${updates.join(', ')} WHERE id = ?`).bind(...bindParams).run();
            } else {
                console.log('[Training Log Insert] Resolved Course ID:', resolvedCourseId);
                console.log('[Training Log Insert] Data:', {
                    resolvedCourseId,
                    safeInstructorId,
                    date,
                    topic,
                    content,
                    teaching_method,
                    safeNcsUnitId,
                    training_hours
                });

                await c.env.DB.prepare(`
                    INSERT INTO training_logs (course_id, instructor_id, date, topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json, schedule_details_json, attendance_summary_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    resolvedCourseId,
                    safeInstructorId,
                    date,
                    safeTopic,
                    content || '',
                    teaching_method || '주입식/실습',
                    safeNcsUnitId,
                    training_hours || 0,
                    ncs_elements_json || null,
                    schedule_details_json || null,
                    attendance_summary_json
                ).run();
            }
        }

        console.log('[Training Log Save] Success');
        return c.json({ success: true, message: id ? '일지가 수정되었습니다.' : '일지가 등록되었습니다.' });
    } catch (e: any) {
        console.error('[Training Log Save] Error:', e);
        console.error('[Training Log Save] Stack:', e.stack);
        return errorResponse(c, '일지 저장 실패: ' + (e.message || String(e)), 500);
    }
});

// 훈련 일지 강사 배정 해제 (instructor_id 만 변경)
app.patch('/training-logs/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const instructor_id = body.instructor_id === undefined ? undefined : (body.instructor_id === '' || body.instructor_id === null ? null : body.instructor_id);
        if (instructor_id === undefined) {
            return c.json({ success: false, error: 'instructor_id is required' }, 400);
        }
        await c.env.DB.prepare(`
            UPDATE training_logs SET instructor_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(instructor_id, id).run();
        return c.json({ success: true, message: '강사 배정이 해제되었습니다.' });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 훈련 일지 삭제
app.delete('/training-logs/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM training_logs WHERE id = ?').bind(id).run();
        return c.json({ success: true, message: '일지가 삭제되었습니다.' });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 과제 제출 현황 요약 조회 — 회차별 과정 개설(/admin/courses/sessions)과 동일한 course_sessions 목록 사용 후 각 LMS 연결
app.get('/assignments/summary', authMiddleware, async (c) => {
    try {
        const statusFilter = (c.req.query('status') || '').toString().toLowerCase().trim();
        let statusCondition = '';
        const params: (string | number)[] = [];
        if (statusFilter && ['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
            statusCondition = ' AND s.status = ?';
            params.push(statusFilter);
        }
        // status=all 또는 비어있음 → 조건 없음 (회차별 과정 개설 페이지와 동일하게 전체 회차)
        let sessions: any[] = [];
        try {
            const q = c.env.DB.prepare(`
                SELECT s.id, s.session_number, s.session_name, s.status, s.instructor_name, a.name as course_name, s.lms_course_id
                FROM course_sessions s
                JOIN approved_courses a ON s.approved_course_id = a.id
                WHERE 1=1 ${statusCondition}
                ORDER BY s.training_start_date DESC, s.id DESC
            `);
            const out = params.length > 0 ? await q.bind(...params).all() : await q.all();
            sessions = out?.results ?? [];
        } catch (err: any) {
            console.error('assignments/summary sessions query:', err?.message);
            return c.json({ success: true, data: [] });
        }

        const statusLabels: Record<string, string> = {
            recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집'
        };

        const summaryData = await Promise.all(sessions.map(async (session: any) => {
            try {
                const courseName = (session.course_name || '과정').trim();
                const sessionNum = session.session_number != null ? String(session.session_number) : '';
                const sessionNamePart = (session.session_name || '').trim();
                const title = `${courseName} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart ? ' - ' + sessionNamePart : ''})`.replace(/\s*\(\s*\)\s*$/, '').trim() || courseName;
                let courseId: number | null = (session.lms_course_id != null && session.lms_course_id > 0) ? Number(session.lms_course_id) : null;
                let resolvedByTitle = false;
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? LIMIT 1').bind(title).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(title).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId == null && (courseName || sessionNum)) {
                    try {
                        const likePattern = '%' + courseName + '%' + (sessionNum ? sessionNum + '회차' : '') + '%';
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind(likePattern).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                // 회차가 있을 때는 과정명만으로 매칭하면 모든 회차가 같은 과정으로 연결되므로, 회차 번호 없이 LIKE 하는 것은 회차가 없을 때만
                if (courseId == null && courseName && !sessionNum) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind('%' + courseName + '%').first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                // LMS 과정 제목에 [2026] 등 연도 접두어가 없는 경우: 접두어 제거 후 재시도
                if (courseId == null && courseName && /^\[\d{4}\]\s*/.test(courseName)) {
                    const courseNameWithoutYear = courseName.replace(/^\[\d{4}\]\s*/, '').trim();
                    if (courseNameWithoutYear) {
                        try {
                            const altTitle = `${courseNameWithoutYear} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart ? ' - ' + sessionNamePart : ''})`.replace(/\s*\(\s*\)\s*$/, '').trim();
                            const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? OR title = ? LIMIT 1').bind(altTitle, altTitle).first();
                            courseId = row?.id ?? null;
                            if (courseId != null) resolvedByTitle = true;
                        } catch (_) { }
                        if (courseId == null) {
                            try {
                                const likePattern = '%' + courseNameWithoutYear + '%' + (sessionNum ? sessionNum + '회차' : '') + '%';
                                const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind(likePattern).first();
                                courseId = row?.id ?? null;
                                if (courseId != null) resolvedByTitle = true;
                            } catch (_) { }
                        }
                        // 회차가 있을 때 과정명만으로 매칭하면 다른 회차와 같은 과정으로 연결되므로, 회차 번호 없이 LIKE 하는 것은 sessionNum 없을 때만
                        if (courseId == null && !sessionNum) {
                            try {
                                const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind('%' + courseNameWithoutYear + '%').first();
                                courseId = row?.id ?? null;
                                if (courseId != null) resolvedByTitle = true;
                            } catch (_) { }
                        }
                    }
                }
                if (courseId != null && resolvedByTitle) {
                    try {
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(courseId, session.id).run();
                    } catch (_) { }
                }

                let assignmentCount = 0, studentCount = 0, totalSubmissions = 0, pendingGrading = 0;
                if (courseId) {
                    try {
                        const aStat: any = await c.env.DB.prepare('SELECT COUNT(*) as assignment_count FROM assignments WHERE course_id = ?').bind(courseId).first();
                        assignmentCount = aStat?.assignment_count ?? 0;
                    } catch (_) { }
                    try {
                        const sStat: any = await c.env.DB.prepare(`
                            SELECT COUNT(*) as total_submissions, COUNT(CASE WHEN sub.status != 'graded' THEN 1 END) as pending_grading
                            FROM assignment_submissions sub JOIN assignments a ON sub.assignment_id = a.id WHERE a.course_id = ?
                        `).bind(courseId).first();
                        totalSubmissions = sStat?.total_submissions ?? 0;
                        pendingGrading = sStat?.pending_grading ?? 0;
                    } catch (_) { }
                    try {
                        const eStat: any = await c.env.DB.prepare("SELECT COUNT(*) as student_count FROM enrollments WHERE course_id = ? AND status = 'approved'").bind(courseId).first();
                        studentCount = eStat?.student_count ?? 0;
                    } catch (_) { }
                }
                const submissionRate = (assignmentCount > 0 && studentCount > 0)
                    ? Math.min(100, Math.round((totalSubmissions / (assignmentCount * studentCount)) * 100))
                    : 0;

                return {
                    id: courseId,
                    title,
                    status: session.status,
                    status_label: statusLabels[session.status] || session.status || '-',
                    teacher_name: session.instructor_name || null,
                    assignment_count: assignmentCount,
                    student_count: studentCount,
                    total_submissions: totalSubmissions,
                    pending_grading: pendingGrading,
                    submission_rate: submissionRate,
                    lms_course_id: courseId,
                    session_id: session.id
                };
            } catch (rowErr: any) {
                console.error('assignments/summary row err session.id=' + session?.id, rowErr?.message);
                return {
                    id: null,
                    title: (session?.course_name || '과정') + ' (오류)',
                    status: session?.status,
                    status_label: statusLabels[session?.status] || '-',
                    teacher_name: session?.instructor_name || null,
                    assignment_count: 0,
                    student_count: 0,
                    total_submissions: 0,
                    pending_grading: 0,
                    submission_rate: 0,
                    lms_course_id: null,
                    session_id: session?.id
                };
            }
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('Failed to fetch assignment summary:', e);
        return errorResponse(c, e?.message || '과제 요약 조회 실패', 500);
    }
});

// 시험 및 CBT 참여 현황 요약 조회 — 회차별(course_sessions) 목록, 과제관리와 동일 구조
app.get('/exams/summary', authMiddleware, async (c) => {
    try {
        const statusFilter = (c.req.query('status') || '').toString().toLowerCase().trim();
        let statusCondition = '';
        const params: (string | number)[] = [];
        if (statusFilter && ['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
            statusCondition = ' AND s.status = ?';
            params.push(statusFilter);
        }
        let sessions: any[] = [];
        try {
            const q = c.env.DB.prepare(`
                SELECT s.id, s.session_number, s.session_name, s.status, s.instructor_name, a.name as course_name, s.lms_course_id
                FROM course_sessions s
                JOIN approved_courses a ON s.approved_course_id = a.id
                WHERE 1=1 ${statusCondition}
                ORDER BY s.training_start_date DESC, s.id DESC
            `);
            const out = params.length > 0 ? await q.bind(...params).all() : await q.all();
            sessions = out?.results ?? [];
        } catch (err: any) {
            console.error('exams/summary sessions query:', err?.message);
            return c.json({ success: true, data: [] });
        }

        const statusLabels: Record<string, string> = {
            recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집'
        };

        const summaryData = await Promise.all(sessions.map(async (session: any) => {
            try {
                const courseName = (session.course_name || '과정').trim();
                const sessionNum = session.session_number != null ? String(session.session_number) : '';
                const sessionNamePart = (session.session_name || '').trim();
                const title = `${courseName} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart ? ' - ' + sessionNamePart : ''})`.replace(/\s*\(\s*\)\s*$/, '').trim() || courseName;
                let courseId: number | null = (session.lms_course_id != null && session.lms_course_id > 0) ? Number(session.lms_course_id) : null;
                let resolvedByTitle = false;
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? LIMIT 1').bind(title).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title = ? LIMIT 1').bind(title).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId == null && (courseName || sessionNum)) {
                    try {
                        const likePattern = '%' + courseName + '%' + (sessionNum ? sessionNum + '회차' : '') + '%';
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind(likePattern).first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId == null && courseName && !sessionNum) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind('%' + courseName + '%').first();
                        courseId = row?.id ?? null;
                        if (courseId != null) resolvedByTitle = true;
                    } catch (_) { }
                }
                if (courseId != null && resolvedByTitle) {
                    try {
                        await c.env.DB.prepare('UPDATE course_sessions SET lms_course_id = ? WHERE id = ?').bind(courseId, session.id).run();
                    } catch (_) { }
                }

                let examCount = 0, studentCount = 0, totalSubmissions = 0;
                let avgScore = 0;
                try {
                    const eStat: any = await c.env.DB.prepare(
                        'SELECT COUNT(*) as student_count FROM course_session_enrollments WHERE session_id = ? AND status IN ("approved", "enrolled")'
                    ).bind(session.id).first();
                    studentCount = eStat?.student_count ?? 0;
                } catch (_) { }
                if (courseId) {
                    try {
                        const xStat: any = await c.env.DB.prepare('SELECT COUNT(*) as exam_count FROM exams WHERE course_id = ?').bind(courseId).first();
                        examCount = xStat?.exam_count ?? 0;
                    } catch (_) { }
                    try {
                        const subStat: any = await c.env.DB.prepare(`
                            SELECT COUNT(DISTINCT student_id || '-' || exam_id) as total_submissions, AVG(total_score) as avg_score
                            FROM exam_submissions s
                            JOIN exams e ON s.exam_id = e.id
                            WHERE e.course_id = ?
                        `).bind(courseId).first();
                        totalSubmissions = subStat?.total_submissions ?? 0;
                        avgScore = Math.round((Number(subStat?.avg_score) || 0) * 10) / 10;
                    } catch (_) { }
                }
                const participationRate = (examCount > 0 && studentCount > 0)
                    ? Math.min(100, Math.round((totalSubmissions / (examCount * studentCount)) * 100))
                    : 0;

                return {
                    session_id: session.id,
                    id: session.id,
                    title,
                    status: session.status,
                    status_label: statusLabels[session.status] || session.status || '-',
                    teacher_name: session.instructor_name || null,
                    exam_count: examCount,
                    student_count: studentCount,
                    total_submissions: totalSubmissions,
                    avg_score: avgScore,
                    participation_rate: participationRate
                };
            } catch (rowErr: any) {
                console.error('exams/summary row err session.id=' + session?.id, rowErr?.message);
                return {
                    session_id: session?.id,
                    id: session?.id,
                    title: (session?.course_name || '과정') + ' (오류)',
                    status: session?.status,
                    status_label: statusLabels[session?.status] || '-',
                    teacher_name: session?.instructor_name || null,
                    exam_count: 0,
                    student_count: 0,
                    total_submissions: 0,
                    avg_score: 0,
                    participation_rate: 0
                };
            }
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('Failed to fetch exam summary:', e);
        return errorResponse(c, e?.message || '시험 요약 조회 실패', 500);
    }
});

// 성적 및 채점 현황 요약 조회 — 회차(course_sessions) 기준, 과제/시험관리와 동일 구조
app.get('/grades/summary', authMiddleware, async (c) => {
    try {
        const statusFilter = (c.req.query('status') || '').toString().toLowerCase().trim();
        let statusCondition = '';
        const params: (string | number)[] = [];
        if (statusFilter && ['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
            statusCondition = ' AND s.status = ?';
            params.push(statusFilter);
        }
        let sessions: any[] = [];
        try {
            const q = c.env.DB.prepare(`
                SELECT s.id, s.session_number, s.session_name, s.status, s.instructor_name, a.name as course_name, s.lms_course_id
                FROM course_sessions s
                JOIN approved_courses a ON s.approved_course_id = a.id
                WHERE 1=1 ${statusCondition}
                ORDER BY s.training_start_date DESC, s.id DESC
            `);
            const out = params.length > 0 ? await q.bind(...params).all() : await q.all();
            sessions = out?.results ?? [];
        } catch (err: any) {
            console.error('grades/summary sessions query:', err?.message);
            return c.json({ success: true, data: [] });
        }

        const statusLabels: Record<string, string> = {
            recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집'
        };

        const summaryData = await Promise.all(sessions.map(async (session: any) => {
            try {
                const courseName = (session.course_name || '과정').trim();
                const sessionNum = session.session_number != null ? String(session.session_number) : '';
                const sessionNamePart = (session.session_name || '').trim();
                const title = `${courseName} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart ? ' - ' + sessionNamePart : ''})`.replace(/\s*\(\s*\)\s*$/, '').trim() || courseName;
                let courseId: number | null = (session.lms_course_id != null && session.lms_course_id > 0) ? Number(session.lms_course_id) : null;
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? LIMIT 1').bind(title).first();
                        if (row?.id) courseId = row.id;
                    } catch (_) { }
                }
                if (courseId == null && title) {
                    try {
                        const likePattern = '%' + courseName + '%' + (sessionNum ? sessionNum + '회차' : '') + '%';
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind(likePattern).first();
                        if (row?.id) courseId = row.id;
                    } catch (_) { }
                }

                let studentCount = 0, testedCount = 0, avgScore = 0, maxScore = 0;
                try {
                    const eStat: any = await c.env.DB.prepare(
                        'SELECT COUNT(*) as student_count FROM course_session_enrollments WHERE session_id = ? AND status IN ("approved", "enrolled")'
                    ).bind(session.id).first();
                    studentCount = eStat?.student_count ?? 0;
                } catch (_) { }
                if (courseId) {
                    try {
                        const gradeStats: any = await c.env.DB.prepare(`
                            SELECT AVG(total_score) as avg_score, MAX(total_score) as max_score, COUNT(DISTINCT student_id) as tested_count
                            FROM exam_submissions s
                            JOIN exams e ON s.exam_id = e.id
                            WHERE e.course_id = ?
                        `).bind(courseId).first();
                        testedCount = gradeStats?.tested_count ?? 0;
                        avgScore = Math.round((Number(gradeStats?.avg_score) || 0) * 10) / 10;
                        maxScore = Number(gradeStats?.max_score) || 0;
                    } catch (_) { }
                }

                return {
                    session_id: session.id,
                    id: session.id,
                    title,
                    status: session.status,
                    status_label: statusLabels[session.status] || session.status || '-',
                    teacher_name: session.instructor_name || null,
                    student_count: studentCount,
                    tested_count: testedCount,
                    avg_score: avgScore,
                    max_score: maxScore
                };
            } catch (rowErr: any) {
                console.error('grades/summary row err session.id=' + session?.id, rowErr?.message);
                return {
                    session_id: session?.id,
                    id: session?.id,
                    title: (session?.course_name || '과정') + ' (오류)',
                    status: session?.status,
                    status_label: statusLabels[session?.status] || '-',
                    teacher_name: session?.instructor_name || null,
                    student_count: 0,
                    tested_count: 0,
                    avg_score: 0,
                    max_score: 0
                };
            }
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('Failed to fetch grade summary:', e);
        return errorResponse(c, e?.message || '성적 요약 조회 실패', 500);
    }
});

// NCS 평가 현황 요약 조회 (전체 과정)
app.get('/ncs-eval/summary', authMiddleware, async (c) => {
    try {
        const { results: courses } = await c.env.DB.prepare(`
            SELECT c.id, c.title, u.name as teacher_name
            FROM courses c
            LEFT JOIN users u ON c.teacher_id = u.id
            WHERE c.status != 'closed'
        `).all();

        const summaryData = await Promise.all(courses.map(async (course: any) => {
            // 1. 해당 과정의 총 NCS 능력단위 수
            const unitStats: any = await c.env.DB.prepare(`
                SELECT COUNT(*) as unit_count
                FROM course_ncs_units
                WHERE course_id = ?
            `).bind(course.id).first();

            // 2. 평가가 완료된(결과가 등록된) 능력단위 수
            const evaluatedStats: any = await c.env.DB.prepare(`
                SELECT COUNT(DISTINCT ncs_unit_id) as evaluated_count
                FROM ncs_evaluation_plans p
                JOIN ncs_evaluation_results r ON p.id = r.plan_id
                WHERE p.course_id = ?
            `).bind(course.id).first();

            // 3. 전체 평균 점수 및 이수 인원
            const scoreStats: any = await c.env.DB.prepare(`
                SELECT 
                    AVG(score) as avg_score,
                    COUNT(CASE WHEN is_passed = 1 THEN 1 END) as passed_count,
                    COUNT(*) as total_evals
                FROM ncs_evaluation_results r
                JOIN ncs_evaluation_plans p ON r.plan_id = p.id
                WHERE p.course_id = ?
            `).bind(course.id).first();

            const unitCount = unitStats.unit_count || 0;
            const evaluatedCount = evaluatedStats.evaluated_count || 0;
            const accomplishmentRate = unitCount > 0 ? Math.round((evaluatedCount / unitCount) * 100) : 0;

            return {
                ...course,
                unit_count: unitCount,
                evaluated_count: evaluatedCount,
                accomplishment_rate: accomplishmentRate,
                avg_score: Math.round((scoreStats.avg_score || 0) * 10) / 10,
                passed_count: scoreStats.passed_count || 0,
                total_evals: scoreStats.total_evals || 0
            };
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('Failed to fetch NCS evaluation summary:', e);
        return errorResponse(c, e.message, 500);
    }
});

// 설문 참여 현황 요약 조회 — 회차(course_sessions) 기준, 과제/시험/성적관리와 동일 구조
app.get('/surveys/summary', authMiddleware, async (c) => {
    try {
        const statusFilter = (c.req.query('status') || '').toString().toLowerCase().trim();
        let statusCondition = '';
        const params: (string | number)[] = [];
        if (statusFilter && ['recruiting', 'in_progress', 'completed', 'closed', 'always_open'].includes(statusFilter)) {
            statusCondition = ' AND s.status = ?';
            params.push(statusFilter);
        }
        let sessions: any[] = [];
        try {
            const q = c.env.DB.prepare(`
                SELECT s.id, s.session_number, s.session_name, s.status, s.instructor_name, a.name as course_name, s.lms_course_id
                FROM course_sessions s
                JOIN approved_courses a ON s.approved_course_id = a.id
                WHERE 1=1 ${statusCondition}
                ORDER BY s.training_start_date DESC, s.id DESC
            `);
            const out = params.length > 0 ? await q.bind(...params).all() : await q.all();
            sessions = out?.results ?? [];
        } catch (err: any) {
            console.error('surveys/summary sessions query:', err?.message);
            return c.json({ success: true, data: [] });
        }

        const statusLabels: Record<string, string> = {
            recruiting: '모집중', in_progress: '진행중', completed: '마감', closed: '종료', always_open: '상시모집'
        };

        const summaryData = await Promise.all(sessions.map(async (session: any) => {
            try {
                const courseName = (session.course_name || '과정').trim();
                const sessionNum = session.session_number != null ? String(session.session_number) : '';
                const sessionNamePart = (session.session_name || '').trim();
                const title = `${courseName} (${sessionNum ? sessionNum + '회차' : ''}${sessionNamePart ? ' - ' + sessionNamePart : ''})`.replace(/\s*\(\s*\)\s*$/, '').trim() || courseName;
                let courseId: number | null = (session.lms_course_id != null && session.lms_course_id > 0) ? Number(session.lms_course_id) : null;
                if (courseId == null && title) {
                    try {
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE TRIM(title) = ? LIMIT 1').bind(title).first();
                        if (row?.id) courseId = row.id;
                    } catch (_) { }
                }
                if (courseId == null && (courseName || sessionNum)) {
                    try {
                        const likePattern = '%' + courseName + '%' + (sessionNum ? sessionNum + '회차' : '') + '%';
                        const row: any = await c.env.DB.prepare('SELECT id FROM courses WHERE title LIKE ? ORDER BY LENGTH(title) ASC LIMIT 1').bind(likePattern).first();
                        if (row?.id) courseId = row.id;
                    } catch (_) { }
                }

                let studentCount = 0, surveyCount = 0, responseCount = 0;
                try {
                    const eStat: any = await c.env.DB.prepare(
                        'SELECT COUNT(*) as student_count FROM course_session_enrollments WHERE session_id = ? AND status IN ("approved", "enrolled")'
                    ).bind(session.id).first();
                    studentCount = eStat?.student_count ?? 0;
                } catch (_) { }

                // session_id 기준 설문 조회 (HRD 회차 설문)
                try {
                    const sStat: any = await c.env.DB.prepare(
                        'SELECT COUNT(*) as survey_count FROM surveys WHERE session_id = ?'
                    ).bind(session.id).first();
                    surveyCount += sStat?.survey_count ?? 0;
                } catch (_) { }
                try {
                    const rStat: any = await c.env.DB.prepare(`
                        SELECT COUNT(*) as response_count FROM survey_responses r
                        JOIN surveys sv ON r.survey_id = sv.id WHERE sv.session_id = ?
                    `).bind(session.id).first();
                    responseCount += rStat?.response_count ?? 0;
                } catch (_) { }

                // course_id 기준 설문도 포함 (lms_course_id 연결된 경우)
                if (courseId) {
                    try {
                        const sStat: any = await c.env.DB.prepare(
                            'SELECT COUNT(*) as survey_count FROM surveys WHERE course_id = ?'
                        ).bind(courseId).first();
                        surveyCount += sStat?.survey_count ?? 0;
                    } catch (_) { }
                    try {
                        const rStat: any = await c.env.DB.prepare(`
                            SELECT COUNT(*) as response_count FROM survey_responses r
                            JOIN surveys sv ON r.survey_id = sv.id WHERE sv.course_id = ?
                        `).bind(courseId).first();
                        responseCount += rStat?.response_count ?? 0;
                    } catch (_) { }
                }

                const participationRate = (surveyCount > 0 && studentCount > 0)
                    ? Math.min(100, Math.round((responseCount / (surveyCount * studentCount)) * 100))
                    : 0;


                return {
                    session_id: session.id,
                    id: session.id,
                    title,
                    status: session.status,
                    status_label: statusLabels[session.status] || session.status || '-',
                    teacher_name: session.instructor_name || null,
                    survey_count: surveyCount,
                    student_count: studentCount,
                    response_count: responseCount,
                    participation_rate: participationRate
                };
            } catch (rowErr: any) {
                console.error('surveys/summary row err session.id=' + session?.id, rowErr?.message);
                return {
                    session_id: session?.id,
                    id: session?.id,
                    title: (session?.course_name || '과정') + ' (오류)',
                    status: session?.status,
                    status_label: statusLabels[session?.status] || '-',
                    teacher_name: session?.instructor_name || null,
                    survey_count: 0,
                    student_count: 0,
                    response_count: 0,
                    participation_rate: 0
                };
            }
        }));

        return c.json({ success: true, data: summaryData });
    } catch (e: any) {
        console.error('Failed to fetch survey summary:', e);
        return errorResponse(c, e.message, 500);
    }
});

// NCS 이수 현황 요약 조회 (대시보드 차트용)
app.get('/courses/:courseId/ncs-summary', async (c) => {
    try {
        const courseIdParam = c.req.param('courseId');
        const courseId = await resolveLmsCourseId(c.env.DB, courseIdParam);

        if (!courseId) {
            return c.json({ success: true, data: [] });
        }

        const query = `
            SELECT 
                u.id as unit_id, u.name as unit_name, u.code as unit_code,
                cnu.training_hours as target_hours,
                COALESCE(SUM(tl.training_hours), 0) as current_hours
            FROM course_ncs_units cnu
            JOIN ncs_units u ON cnu.ncs_unit_id = u.id
            LEFT JOIN training_logs tl ON tl.course_id = cnu.course_id AND tl.ncs_unit_id = cnu.ncs_unit_id
            WHERE cnu.course_id = ?
            GROUP BY u.id, u.name, u.code, cnu.training_hours
            ORDER BY u.code ASC
        `;
        const { results } = await c.env.DB.prepare(query).bind(courseId).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 수료생 취업 현황 조회
app.get('/courses/:courseId/employment', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const courseIdParam = c.req.param('courseId');
        const courseId = await resolveLmsCourseId(c.env.DB, courseIdParam);

        if (!courseId) {
            return c.json({ success: true, data: [] });
        }

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(courseId).first();
            if (!course || course.teacher_id !== user.userId) {
                // 회차인 경우 시간표 권한도 확인 (이미 resolveLmsCourseId를 통과했다면 제목 기반 매핑이 성공한 것임)
                // 하지만 제목 매핑된 shadow course의 teacher_id가 현재 teacherId와 다를 수 있으므로 
                // session_timetable 기반 권한 체크를 한 번 더 수행
                const isInstructor = await c.env.DB.prepare("SELECT 1 FROM session_timetable WHERE session_id = ? AND instructor_id = ? LIMIT 1").bind(courseIdParam, user.userId).first();
                if (!isInstructor) {
                    return forbiddenResponse(c, '이 과정(회차)에 대한 권한이 없습니다.');
                }
            }
        }
        const query = `
            SELECT 
                u.id as student_id, u.name, u.phone,
                es.id as employment_id, es.status, es.company_name, es.job_title, 
                es.employment_date, es.insurance_covered, es.notes
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            LEFT JOIN employment_status es ON es.student_id = u.id AND es.course_id = ?
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;
        const { results } = await c.env.DB.prepare(query).bind(courseId, courseId).all();
        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 취업 현황 저장/수정
app.post('/employment', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const body = await c.req.json();
        const { student_id, course_id, status, company_name, job_title, employment_date, insurance_covered, notes } = body;

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(course_id).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        // UPSERT logic using INSERT OR REPLACE (works in SQLite/D1 if there's a unique constraint, but we'll use conditional check)
        const existing = await c.env.DB.prepare("SELECT id FROM employment_status WHERE student_id = ? AND course_id = ?")
            .bind(student_id, course_id).first();

        if (existing) {
            await c.env.DB.prepare(`
                UPDATE employment_status 
                SET status = ?, company_name = ?, job_title = ?, employment_date = ?, insurance_covered = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(status, company_name, job_title, employment_date, insurance_covered ? 1 : 0, notes, existing.id).run();
        } else {
            await c.env.DB.prepare(`
                INSERT INTO employment_status (student_id, course_id, status, company_name, job_title, employment_date, insurance_covered, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(student_id, course_id, status, company_name, job_title, employment_date, insurance_covered ? 1 : 0, notes).run();
        }

        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});


// 학생 자신의 취업 현황 조회
app.get('/my-employment', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const query = `
            SELECT 
                c.id as course_id, c.title as course_title,
                es.status, es.company_name, es.job_title, 
                es.employment_date, es.insurance_covered, es.notes
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN employment_status es ON es.student_id = ? AND es.course_id = c.id
            WHERE e.user_id = ? AND e.status = 'approved'
            ORDER BY c.start_date DESC
        `;
        const { results } = await c.env.DB.prepare(query).bind(user.userId, user.userId).all();
        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 학생 자신의 취업 현황 업데이트
app.post('/my-employment', authMiddleware, async (c) => {
    try {
        const user = c.get('user') as JWTPayload;
        const body = await c.req.json();
        const { course_id, status, company_name, job_title, employment_date, insurance_covered, notes } = body;

        // Check if student is actually enrolled in this course
        const enrollment = await c.env.DB.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'approved'")
            .bind(user.userId, course_id).first();

        if (!enrollment) {
            return errorResponse(c, '해당 과정에 대한 수강 기록이 없습니다.', 403);
        }

        const existing = await c.env.DB.prepare("SELECT id FROM employment_status WHERE student_id = ? AND course_id = ?")
            .bind(user.userId, course_id).first();

        if (existing) {
            await c.env.DB.prepare(`
                UPDATE employment_status 
                SET status = ?, company_name = ?, job_title = ?, employment_date = ?, insurance_covered = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(status, company_name, job_title, employment_date, insurance_covered ? 1 : 0, notes, existing.id).run();
        } else {
            await c.env.DB.prepare(`
                INSERT INTO employment_status (student_id, course_id, status, company_name, job_title, employment_date, insurance_covered, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(user.userId, course_id, status, company_name, job_title, employment_date, insurance_covered ? 1 : 0, notes).run();
        }

        return c.json({ success: true, message: '취업 정보가 업데이트되었습니다.' });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// ============================================
// 시설 관리 API
// ============================================

// 시설 목록 조회
app.get('/facilities', async (c) => {
    try {
        const search = c.req.query('search');
        let query = 'SELECT * FROM hrd_facilities';
        const params: any[] = [];

        if (search) {
            query += ' WHERE name LIKE ? OR manager_main LIKE ? OR description LIKE ?';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        query += ' ORDER BY created_at DESC';

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 상세 조회
app.get('/facilities/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const facility = await c.env.DB.prepare('SELECT * FROM hrd_facilities WHERE id = ?').bind(id).first();

        if (!facility) {
            return errorResponse(c, '시설을 찾을 수 없습니다.', 404);
        }

        return c.json({ success: true, data: facility });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 등록
app.post('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { name, status, area, manager_main, manager_sub, description, image_url } = body;

        const result = await c.env.DB.prepare(`
            INSERT INTO hrd_facilities (name, status, area, manager_main, manager_sub, description, image_url, last_check)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(name, status || '양호', area, manager_main, manager_sub, description, image_url || null).run();

        return c.json({ success: true, data: { id: result.meta.last_row_id } });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 수정
app.put('/facilities', async (c) => {
    try {
        const body = await c.req.json();
        const { id, name, status, area, manager_main, manager_sub, description, image_url } = body;

        await c.env.DB.prepare(`
            UPDATE hrd_facilities 
            SET name = ?, status = ?, area = ?, manager_main = ?, manager_sub = ?, description = ?, image_url = ?, last_check = datetime('now')
            WHERE id = ?
        `).bind(name, status, area, manager_main, manager_sub, description, image_url || null, id).run();

        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 삭제
app.delete('/facilities/:id', async (c) => {
    try {
        const id = c.req.param('id');
        await c.env.DB.prepare('DELETE FROM hrd_facilities WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 보유 비품 목록 조회 (중요!)
app.get('/facilities/:id/items', async (c) => {
    try {
        const facilityId = c.req.param('id');

        const { results } = await c.env.DB.prepare(`
            SELECT 
                i.id, i.category, i.name, i.model, i.status, i.location, i.memo,
                fi.quantity, fi.assigned_at
            FROM hrd_facility_items fi
            JOIN hrd_items i ON fi.item_id = i.id
            WHERE fi.facility_id = ?
            ORDER BY i.category, i.name
        `).bind(facilityId).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설에 물품 배정
app.post('/facilities/:id/items', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { item_id, quantity } = body;

        await c.env.DB.prepare(`
            INSERT OR REPLACE INTO hrd_facility_items (facility_id, item_id, quantity)
            VALUES (?, ?, ?)
        `).bind(facilityId, item_id, quantity || 1).run();

        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설에서 물품 제거
app.delete('/facilities/:facilityId/items/:itemId', async (c) => {
    try {
        const facilityId = c.req.param('facilityId');
        const itemId = c.req.param('itemId');

        await c.env.DB.prepare('DELETE FROM hrd_facility_items WHERE facility_id = ? AND item_id = ?')
            .bind(facilityId, itemId).run();

        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 중복된 엔드포인트 제거됨 - 위의 1016번과 1111번 라인에 이미 정의되어 있음

// 시설 이미지 목록
app.get('/facilities/:id/images', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const { results } = await c.env.DB.prepare('SELECT * FROM hrd_facility_images WHERE facility_id = ? ORDER BY created_at DESC')
            .bind(facilityId).all();

        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 시설 이미지 추가
app.post('/facilities/:id/images', async (c) => {
    try {
        const facilityId = c.req.param('id');
        const body = await c.req.json();
        const { name, size, url } = body;

        await c.env.DB.prepare('INSERT INTO hrd_facility_images (facility_id, name, size, url) VALUES (?, ?, ?, ?)')
            .bind(facilityId, name, size, url).run();

        return c.json({ success: true });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// End of HRD API
export default app;
