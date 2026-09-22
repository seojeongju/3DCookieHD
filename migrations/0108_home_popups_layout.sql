-- 메인 팝업 크기·위치
ALTER TABLE home_popups ADD COLUMN popup_size TEXT DEFAULT 'md';
ALTER TABLE home_popups ADD COLUMN popup_position TEXT DEFAULT 'center';
