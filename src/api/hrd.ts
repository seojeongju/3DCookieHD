import { Hono } from 'hono';
import { Bindings, JWTPayload, Variables } from '../types';
import { successResponse, errorResponse, forbiddenResponse } from '../utils/response';
import { authMiddleware } from '../middleware/auth';

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

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

// 훈련생 목록 조회
app.get('/students', async (c) => {
    try {
        const search = c.req.query('search');
        const status = c.req.query('status');
        const type = c.req.query('type');

        // === [최종 정상 버전] ===
        // DB 마이그레이션 완료: birthdate, gender, address, education, certifications 컬럼 사용 가능

        let query = `
            SELECT 
                u.id, u.name, u.phone, u.email, u.created_at,
                u.address, u.birthdate, u.gender, u.education, u.certifications, u.profile_image,
                d.course_id, d.status, d.type, d.last_consult,
                d.package_type, d.payment_method, d.payment_date, d.self_pay_amount,
                d.has_application, d.has_card, d.is_hrd_net_registered, d.status_memo
            FROM users u
            LEFT JOIN hrd_student_details d ON u.id = d.user_id
            WHERE u.role = 'student'
        `;
        const params: any[] = [];

        if (search) {
            query += " AND (u.name LIKE ? OR u.phone LIKE ?)";
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        if (status) {
            query += " AND d.status = ?";
            params.push(status);
        }

        if (type) {
            query += " AND d.type = ?";
            params.push(type);
        }

        query += " ORDER BY u.created_at DESC";

        const stmt = c.env.DB.prepare(query);
        const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

        // 데이터 매핑
        const safeResults = (results || []).map((r: any) => ({
            ...r,
            // 상세 정보가 없을 경우를 대비한 기본값 처리
            course_id: r.course_id || null,
            status: r.status || 'consulting',
            type: r.type || 'jobseeker',
            last_consult: r.last_consult || null,
            // boolean 변환 등 필요한 추가 가공
            has_application: !!r.has_application,
            has_card: !!r.has_card,
            is_hrd_net_registered: !!r.is_hrd_net_registered
        }));

        return c.json({ success: true, data: safeResults });

    } catch (e: any) {
        console.error('Failed to fetch students:', e);
        // 이제는 진짜 서버 에러(500)를 반환해도 됨 (원인을 다 잡았으므로)
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
            certifications, type, status, course_id, package_type, payment_method,
            payment_date, self_pay_amount, has_application, has_card,
            is_hrd_net_registered, status_memo, profile_image
        } = body;

        if (!name || !phone) {
            return c.json({ success: false, error: '이름과 연락처는 필수항목입니다.' }, 400);
        }

        // 1. 사용자 확인/생성
        let user: any = await c.env.DB.prepare("SELECT id FROM users WHERE phone = ?").bind(phone).first();
        let userId: number;

        const valEmail = email || `${phone}@temp.com`;
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
        const valPackageType = package_type || null;
        const valPaymentMethod = payment_method || null;
        const valPaymentDate = payment_date || null;
        const valSelfPayAmount = parseInt(self_pay_amount || '0') || 0;
        const valStatusMemo = status_memo || null;

        // 2. HRD 상세 정보 등록/업데이트
        await c.env.DB.prepare(`
            INSERT INTO hrd_student_details (
                user_id, course_id, status, type, package_type, payment_method, payment_date,
                self_pay_amount, has_application, has_card, is_hrd_net_registered, 
                status_memo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                course_id = ?, status = ?, type = ?, package_type = ?, payment_method = ?, 
                payment_date = ?, self_pay_amount = ?, has_application = ?, has_card = ?, 
                is_hrd_net_registered = ?, status_memo = ?,
                updated_at = CURRENT_TIMESTAMP
        `).bind(
            userId, hrdCourseId, valStatus, valType, valPackageType, valPaymentMethod, valPaymentDate,
            valSelfPayAmount, has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, valStatusMemo,
            // UPDATE values
            hrdCourseId, valStatus, valType, valPackageType, valPaymentMethod, valPaymentDate,
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
            certifications, type, status, course_id, package_type, payment_method,
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

        // 2. HRD 상세 정보 업데이트 (레코드가 없을 경우를 대비해 UPSERT 수행)
        await c.env.DB.prepare(`
            INSERT INTO hrd_student_details (
                user_id, course_id, status, type, package_type, payment_method, 
                payment_date, self_pay_amount, has_application, has_card, 
                is_hrd_net_registered, status_memo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                course_id = ?, status = ?, type = ?, package_type = ?, payment_method = ?, 
                payment_date = ?, self_pay_amount = ?, has_application = ?, has_card = ?, 
                is_hrd_net_registered = ?, status_memo = ?,
                updated_at = CURRENT_TIMESTAMP
        `).bind(
            id, hrdCourseId, status || 'consulting', type || 'jobseeker', package_type || null, payment_method || null, payment_date || null,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo || null,
            // UPDATE values
            hrdCourseId, status || 'consulting', type || 'jobseeker', package_type || null, payment_method || null, payment_date || null,
            parseInt(self_pay_amount || 0), has_application ? 1 : 0, has_card ? 1 : 0,
            is_hrd_net_registered ? 1 : 0, status_memo || null
        ).run();

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Failed to update student:', e);
        return c.json({ success: false, error: '훈련생 수정 실패: ' + e.message }, 500);
    }
});

// 상담 이력 조회 (상담일지 통합 및 권한 필터링)
app.get('/students/:id/consultations', authMiddleware, async (c) => {
    try {
        const id = c.req.param('id');
        const user = c.get('user'); // JWTPayload

        let query = `
            SELECT 
                cl.id,
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

        // 권한 필터링: 선생(teacher)은 본인이 작성한 상담만 조회 (admin은 전체 조회)
        if (user.role === 'teacher') {
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

// 상담 이력 추가 (상담일지 통합)
app.post('/students/:id/consultations', async (c) => {
    try {
        const userId = c.req.param('id');
        const body = await c.req.json();
        const { content, manager, date, category, method, course_id } = body;

        // 상담자 ID 찾기 (관리자 우선, 없으면 1번)
        let counselorId = 1;
        if (manager) {
            const admin = await c.env.DB.prepare("SELECT id FROM users WHERE name = ? AND role = 'admin'").bind(manager).first();
            if (admin) counselorId = (admin as any).id;
        }

        // hrd_counseling_logs 에 저장
        await c.env.DB.prepare(`
            INSERT INTO hrd_counseling_logs (
                student_id, counselor_id, course_id, counseling_date, 
                category, method, content, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
            userId, counselorId, course_id || null,
            date || new Date().toISOString().split('T')[0],
            category || 'academic', method || 'face_to_face', content
        ).run();

        // last_consult 업데이트
        await c.env.DB.prepare(`
            UPDATE hrd_student_details 
            SET last_consult = ?
            WHERE user_id = ?
        `).bind(date || new Date().toISOString().split('T')[0], userId).run();

        return c.json({ success: true });
    } catch (e: any) {
        console.error('Failed to add consultation:', e);
        return c.json({ success: false, error: '상담 이력 추가 실패: ' + e.message }, 500);
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
            WHERE 1=1
        `;
        const params: any[] = [];

        if (search) {
            query += " AND name LIKE ?";
            params.push(`%${search}%`);
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
            INSERT INTO hrd_facilities (name, area, manager_main, manager_sub, description, status)
            VALUES (?, ?, ?, ?, ?, '양호')
        `).bind(name, area ? parseFloat(area) : null, managerMain || null, managerSub || null, description || null).run();

        const facilityId = result.meta.last_row_id;

        // 초기 이미지가 있는 경우 이미지 테이블에도 등록
        if (image_url) {
            await c.env.DB.prepare(`
                INSERT INTO hrd_facility_images (facility_id, name, size, url)
                VALUES (?, ?, ?, ?)
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
                INSERT INTO hrd_facility_images (facility_id, name, size, url)
                VALUES (?, ?, ?, ?)
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

        // 안전 장치: 테이블이 없으면 생성
        await c.env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS hrd_facility_maintenance (
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

        // 기존 테이블이 있을 경우 컬럼 누락 방지 (마이그레이션)
        try {
            await c.env.DB.prepare("SELECT progress FROM hrd_facility_maintenance LIMIT 1").first();
        } catch (e) {
            try {
                await c.env.DB.prepare("ALTER TABLE hrd_facility_maintenance ADD COLUMN progress TEXT DEFAULT 'pending'").run();
            } catch (alterError) { console.error('Failed to add progress column', alterError); }
        }

        try {
            await c.env.DB.prepare("SELECT updated_at FROM hrd_facility_maintenance LIMIT 1").first();
        } catch (e) {
            try {
                await c.env.DB.prepare("ALTER TABLE hrd_facility_maintenance ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP").run();
            } catch (alterError) { console.error('Failed to add updated_at column', alterError); }
        }

        const { results } = await c.env.DB.prepare(`
            SELECT * FROM hrd_facility_maintenance 
            WHERE facility_id = ? 
            ORDER BY date DESC, created_at DESC
        `).bind(id).all();
        return c.json({ success: true, data: results });
    } catch (e) {
        console.error('Failed to fetch maintenance logs:', e);
        return c.json({ success: false, error: '시설 관리 대장 조회 실패' }, 500);
    }
});

// 시설 관리 대장 항목 수정 (상태 변경 등)
app.put('/facilities/maintenance/:logId', async (c) => {
    try {
        const logId = c.req.param('logId');
        const body = await c.req.json();
        const { progress, title, price, vendor, memo, date } = body;

        // 동적 업데이트 쿼리 (SET 구문을 동적으로 생성)
        const updates: string[] = [];
        const params: any[] = [];

        if (progress) { updates.push("progress = ?"); params.push(progress); }
        if (title) { updates.push("title = ?"); params.push(title); }
        if (price !== undefined) { updates.push("price = ?"); params.push(parseInt(price || 0)); }
        if (vendor !== undefined) { updates.push("vendor = ?"); params.push(vendor); }
        if (memo !== undefined) { updates.push("memo = ?"); params.push(memo); }
        if (date) { updates.push("date = ?"); params.push(date); }

        if (updates.length === 0) {
            return c.json({ success: true, message: '변경 내용 없음' });
        }

        const query = `UPDATE hrd_facility_maintenance SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        params.push(logId);

        try {
            await c.env.DB.prepare(query).bind(...params).run();
        } catch (dbError) {
            // updated_at 컬럼이 없을 경우를 대비한 폴백 (과도기적 조치)
            const fallbackQuery = `UPDATE hrd_facility_maintenance SET ${updates.join(", ")} WHERE id = ?`;
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
        if (isNaN(fId)) return c.json({ success: false, error: `유효하지 않은 시설 ID: ${facilityId}` }, 400);

        // 상세 로그 로깅 (서버 콘솔용)
        console.log(`Adding maintenance log: facilityId=${fId}, status=${status}, title=${title}`);

        try {
            await c.env.DB.prepare(`
                INSERT INTO hrd_facility_maintenance (facility_id, status, title, price, vendor, manager, memo, date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
            INSERT INTO hrd_facility_images (facility_id, name, size, url)
            VALUES (?, ?, ?, ?)
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
        const { results } = await c.env.DB.prepare("SELECT * FROM hrd_items WHERE location LIKE ?").bind(`%${facility.name}%`).all();

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

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(courseId).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
            }
        }

        // 1. 해당 과정의 수강생 목록 및 출석 정보 조회 (통합된 attendance_logs 테이블 사용)
        // HRD 뷰 호환성을 위해 필드명 매핑 (check_in_time -> in_time 등)
        const query = `
            SELECT 
                u.id, u.name, u.phone,
                d.package_type,
                e.id as enrollment_id,
                al.status,
                al.check_in_time as in_time,
                al.check_out_time as out_time,
                al.note as memo
            FROM users u
            JOIN hrd_student_details d ON u.id = d.user_id
            JOIN enrollments e ON u.id = e.user_id
            LEFT JOIN attendance_logs al ON e.id = al.enrollment_id AND al.date = ?
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;

        const { results } = await c.env.DB.prepare(query).bind(date, courseId).all();

        // 데이터 포맷팅
        const resultData = results.map((row: any) => ({
            id: row.id,
            name: row.name,
            phone: row.phone,
            package_type: row.package_type,
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

// 월간 출석부 조회 (출력용)
app.get('/attendance/monthly', async (c) => {
    try {
        const courseId = c.req.query('courseId');
        const year = c.req.query('year');
        const month = c.req.query('month'); // 1-12

        if (!courseId || !year || !month) {
            return c.json({ success: false, error: '필수 정보가 누락되었습니다.' }, 400);
        }

        const dateStr = `${year}-${month.toString().padStart(2, '0')}`; // YYYY-MM

        // 1. 수강생 목록 조회
        const studentsQuery = `
            SELECT u.id, u.name, u.phone, e.id as enrollment_id
            FROM users u
            JOIN enrollments e ON u.id = e.user_id
            WHERE e.course_id = ? AND u.role = 'student'
            ORDER BY u.name ASC
        `;
        const { results: students } = await c.env.DB.prepare(studentsQuery).bind(courseId).all();

        // 2. 해당 월의 출석 기록 조회
        // SQLite strftime('%Y-%m', date) uses matching pattern
        const logsQuery = `
            SELECT al.enrollment_id, al.date, al.status
            FROM attendance_logs al
            JOIN enrollments e ON al.enrollment_id = e.id
            WHERE e.course_id = ? AND strftime('%Y-%m', al.date) = ?
        `;
        const { results: logs } = await c.env.DB.prepare(logsQuery).bind(courseId, dateStr).all();

        // 3. 데이터 병합
        const data = students.map((s: any) => {
            const studentLogs = (logs as any[]).filter(l => l.enrollment_id === s.enrollment_id);
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
        const studentCount = studentCountResult ? studentCountResult.count : 0;
        const activeCourseCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM courses WHERE status = 'active'").first('count');
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

                    // 출석(present) 또는 지각(late) 수
                    const presentLogs: any = await c.env.DB.prepare(
                        "SELECT COUNT(*) as count FROM attendance_logs WHERE status IN ('present', 'late')"
                    ).first();

                    const rate = (presentLogs.count / totalLogs.count) * 100;
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

// GET /api/hrd/counseling - 상담 일지 목록 조회
app.get('/counseling', async (c) => {
    try {
        const studentId = c.req.query('student_id');
        const courseId = c.req.query('course_id');
        const search = c.req.query('search');

        let query = `
            SELECT 
                cl.*,
                u_student.name as student_name,
                u_student.profile_image as student_image,
                u_counselor.name as counselor_name,
                c.title as course_title
            FROM hrd_counseling_logs cl
            LEFT JOIN users u_student ON cl.student_id = u_student.id
            LEFT JOIN users u_counselor ON cl.counselor_id = u_counselor.id
            LEFT JOIN courses c ON cl.course_id = c.id
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

        if (search) {
            query += ' AND (u_student.name LIKE ? OR cl.content LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY cl.counseling_date DESC';

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return successResponse(c, results);
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// POST /api/hrd/counseling - 상담 일지 등록
app.post('/counseling', async (c) => {
    try {
        const body = await c.req.json();
        // counselor_id should ideally come from auth token, but for now we accept it or default to 1 (admin)
        const counselorId = body.counselor_id || 1;

        await c.env.DB.prepare(`
            INSERT INTO hrd_counseling_logs (student_id, counselor_id, course_id, counseling_date, category, method, content, result, next_counseling_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            body.student_id, counselorId, body.course_id,
            body.counseling_date || new Date().toISOString(),
            body.category, body.method, body.content, body.result, body.next_counseling_date
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 등록되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// PUT /api/hrd/counseling/:id - 상담 일지 수정
app.put('/counseling/:id', async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        await c.env.DB.prepare(`
            UPDATE hrd_counseling_logs 
            SET course_id = ?, counseling_date = ?, category = ?, method = ?, content = ?, result = ?, next_counseling_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(
            body.course_id, body.counseling_date, body.category, body.method,
            body.content, body.result, body.next_counseling_date, id
        ).run();

        return successResponse(c, { success: true }, '상담 일지가 수정되었습니다.');
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// DELETE /api/hrd/counseling/:id - 상담 일지 삭제
app.delete('/counseling/:id', async (c) => {
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
app.get('/training-logs', async (c) => {
    try {
        const courseId = c.req.query('courseId');
        const startDate = c.req.query('startDate');
        const endDate = c.req.query('endDate');

        let query = `
            SELECT t.*, u.name as ncs_unit_name, u.code as ncs_unit_code
            FROM training_logs t
            LEFT JOIN ncs_units u ON t.ncs_unit_id = u.id
            WHERE t.course_id = ?
        `;
        const params: any[] = [courseId];

        if (startDate && endDate) {
            query += " AND t.date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        }

        query += " ORDER BY t.date DESC";

        const { results } = await c.env.DB.prepare(query).bind(...params).all();
        return c.json({ success: true, data: results });
    } catch (e: any) {
        return errorResponse(c, e.message, 500);
    }
});

// 훈련 일지 상세 조회
app.get('/training-logs/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const result = await c.env.DB.prepare(`
            SELECT t.*, u.name as ncs_unit_name, u.code as ncs_unit_code
            FROM training_logs t
            LEFT JOIN ncs_units u ON t.ncs_unit_id = u.id
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
        const { id, course_id, instructor_id, date, topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json } = body;

        if (id) {
            // 수정
            await c.env.DB.prepare(`
                UPDATE training_logs 
                SET topic = ?, content = ?, teaching_method = ?, ncs_unit_id = ?, training_hours = ?, ncs_elements_json = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json, id).run();
        } else {
            // 등록
            await c.env.DB.prepare(`
                INSERT INTO training_logs (course_id, instructor_id, date, topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(course_id, instructor_id, date, topic, content, teaching_method, ncs_unit_id, training_hours, ncs_elements_json).run();
        }

        return c.json({ success: true, message: id ? '일지가 수정되었습니다.' : '일지가 등록되었습니다.' });
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

// NCS 이수 현황 요약 조회 (대시보드 차트용)
app.get('/courses/:courseId/ncs-summary', async (c) => {
    try {
        const courseId = c.req.param('courseId');

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
        const courseId = c.req.param('courseId');

        // 강사인 경우 권한 확인
        if (user.role === 'teacher') {
            const course: any = await c.env.DB.prepare("SELECT teacher_id FROM courses WHERE id = ?").bind(courseId).first();
            if (!course || course.teacher_id !== user.userId) {
                return forbiddenResponse(c, '이 과정에 대한 권한이 없습니다.');
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
