-- NCS 능력단위요소 INSERT SQL문
-- ncs_units.code → ncs_elements.ncs_unit_id FK 연결
-- DB 명령어: wrangler d1 execute education-platform-db --local --file=./scripts/ncs-elements.sql
-- 사전 조건: 대상 능력단위가 ncs_units에 존재해야 한다.

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110202_23v3.01', '시장조사하기' FROM ncs_units WHERE code = '1903110202_23v3'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110202_23v3.02', '제품컨셉수립하기' FROM ncs_units WHERE code = '1903110202_23v3'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110202_23v3.03', '제품사양결정하기' FROM ncs_units WHERE code = '1903110202_23v3'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110210_24v1.01', '3D모델링 SW 기능 파악하기' FROM ncs_units WHERE code = '1903110210_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110210_24v1.02', '3D모델링 SW 설정하기' FROM ncs_units WHERE code = '1903110210_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110210_24v1.03', '3D모델링 SW 점검하기' FROM ncs_units WHERE code = '1903110210_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110211_24v1.01', '3D프린터 구조 파악하기' FROM ncs_units WHERE code = '1903110211_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110211_24v1.02', '3D프린터 제어시스템 설정하기' FROM ncs_units WHERE code = '1903110211_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110211_24v1.03', '3D프린터 작동 점검하기' FROM ncs_units WHERE code = '1903110211_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110215_24v1.01', '3D프린팅 설계요소 파악하기' FROM ncs_units WHERE code = '1903110215_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110215_24v1.02', '3D프린팅 특화 모델링하기' FROM ncs_units WHERE code = '1903110215_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110215_24v1.03', '3D프린팅 적합성 검증하기' FROM ncs_units WHERE code = '1903110215_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110216_24v1.01', '재료 물성 파악하기' FROM ncs_units WHERE code = '1903110216_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110216_24v1.02', '재료 시험 수행하기' FROM ncs_units WHERE code = '1903110216_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110216_24v1.03', '재료 시험 결과 분석하기' FROM ncs_units WHERE code = '1903110216_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110217_24v1.01', '적층제조 준비하기' FROM ncs_units WHERE code = '1903110217_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110217_24v1.02', '적층제조 수행하기' FROM ncs_units WHERE code = '1903110217_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110217_24v1.03', '적층제조 품질관리하기' FROM ncs_units WHERE code = '1903110217_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110218_24v1.01', '서포트 제거하기' FROM ncs_units WHERE code = '1903110218_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110218_24v1.02', '표면처리하기' FROM ncs_units WHERE code = '1903110218_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;
INSERT INTO ncs_elements (ncs_unit_id, code, name)
SELECT id, '1903110218_24v1.03', '마무리 작업하기' FROM ncs_units WHERE code = '1903110218_24v1'
ON CONFLICT(ncs_unit_id, code) DO UPDATE SET name = excluded.name;

-- 총 21개 레코드
