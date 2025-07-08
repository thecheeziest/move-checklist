-- 기존 테이블 삭제
DROP TABLE IF EXISTS "purchase_items" CASCADE;
DROP TABLE IF EXISTS "schedule_items" CASCADE;

-- 마이그레이션 히스토리 테이블도 삭제
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE; 