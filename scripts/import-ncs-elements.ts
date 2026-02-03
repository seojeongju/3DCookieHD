/**
 * NCS 능력단위요소 데이터 임포트 스크립트
 * 
 * 사용법:
 * 1. NCS 공식 사이트 또는 HRD-Net에서 능력단위 데이터 다운로드
 * 2. JSON 형식으로 변환하여 data 폴더에 저장
 * 3. wrangler d1 execute로 DB에 insert
 */

interface NcsElement {
    unit_code: string;
    code: string;
    name: string;
    description?: string;
}

// 3D 프린팅 관련 능력단위요소 데이터
const NCS_ELEMENTS_DATA: NcsElement[] = [
    // 제품기획 (1903110202_23v3)
    { unit_code: '1903110202_23v3', code: '1903110202_23v3.01', name: '시장조사하기' },
    { unit_code: '1903110202_23v3', code: '1903110202_23v3.02', name: '제품컨셉수립하기' },
    { unit_code: '1903110202_23v3', code: '1903110202_23v3.03', name: '제품사양결정하기' },

    // 3D프린터 SW 설정 (1903110210_24v1)
    { unit_code: '1903110210_24v1', code: '1903110210_24v1.01', name: '3D모델링 SW 기능 파악하기' },
    { unit_code: '1903110210_24v1', code: '1903110210_24v1.02', name: '3D모델링 SW 설정하기' },
    { unit_code: '1903110210_24v1', code: '1903110210_24v1.03', name: '3D모델링 SW 점검하기' },

    // 3D프린터 HW 설정 (1903110211_24v1)
    { unit_code: '1903110211_24v1', code: '1903110211_24v1.01', name: '3D프린터 구조 파악하기' },
    { unit_code: '1903110211_24v1', code: '1903110211_24v1.02', name: '3D프린터 제어시스템 설정하기' },
    { unit_code: '1903110211_24v1', code: '1903110211_24v1.03', name: '3D프린터 작동 점검하기' },

    // 3D프린팅 특화설계 (1903110215_24v1)
    { unit_code: '1903110215_24v1', code: '1903110215_24v1.01', name: '3D프린팅 설계요소 파악하기' },
    { unit_code: '1903110215_24v1', code: '1903110215_24v1.02', name: '3D프린팅 특화 모델링하기' },
    { unit_code: '1903110215_24v1', code: '1903110215_24v1.03', name: '3D프린팅 적합성 검증하기' },

    // 3D프린팅 재료 시험 (1903110216_24v1)
    { unit_code: '1903110216_24v1', code: '1903110216_24v1.01', name: '재료 물성 파악하기' },
    { unit_code: '1903110216_24v1', code: '1903110216_24v1.02', name: '재료 시험 수행하기' },
    { unit_code: '1903110216_24v1', code: '1903110216_24v1.03', name: '재료 시험 결과 분석하기' },

    // 3D프린팅 적층제조 (1903110217_24v1)
    { unit_code: '1903110217_24v1', code: '1903110217_24v1.01', name: '적층제조 준비하기' },
    { unit_code: '1903110217_24v1', code: '1903110217_24v1.02', name: '적층제조 수행하기' },
    { unit_code: '1903110217_24v1', code: '1903110217_24v1.03', name: '적층제조 품질관리하기' },

    // 3D프린팅 후가공 (1903110218_24v1)
    { unit_code: '1903110218_24v1', code: '1903110218_24v1.01', name: '서포트 제거하기' },
    { unit_code: '1903110218_24v1', code: '1903110218_24v1.02', name: '표면처리하기' },
    { unit_code: '1903110218_24v1', code: '1903110218_24v1.03', name: '마무리 작업하기' }
];

// SQL 생성
console.log('-- NCS 능력단위요소 INSERT SQL문');
console.log('-- DB 명령어: wrangler d1 execute education-platform-db --local --file=./scripts/ncs-elements.sql');
console.log('');

for (const elem of NCS_ELEMENTS_DATA) {
    const sql = `INSERT INTO ncs_elements (unit_code, code, name) VALUES ('${elem.unit_code}', '${elem.code}', '${elem.name}');`;
    console.log(sql);
}

console.log('');
console.log(`-- 총 ${NCS_ELEMENTS_DATA.length}개 레코드`);
