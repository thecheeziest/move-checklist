# Checklist App

Next.js App Router 기반의 체크리스트 애플리케이션입니다. 구입 체크리스트와 일정 체크리스트를 관리할 수 있습니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **State Management**: Zustand
- **Deployment**: Vercel

## 주요 기능

- 구입 체크리스트 관리 (가구, 가전, 소품, 정리, 식기, 렌트, 기타)
- 일정 체크리스트 관리
- 드래그 앤 드롭으로 순서 변경 및 상태 변경
- 실시간 데이터 동기화
- 반응형 디자인

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요.
2. Database > Settings > Database에서 연결 정보를 확인하세요.
3. Settings > API에서 API 키들을 확인하세요.

### 4. 데이터베이스 마이그레이션

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma db push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

## API 엔드포인트

### 구입 체크리스트 API

- `GET /api/purchase` - 모든 구입 항목 조회
- `POST /api/purchase` - 새로운 구입 항목 생성
- `GET /api/purchase/[id]` - 특정 구입 항목 조회
- `PUT /api/purchase/[id]` - 구입 항목 수정
- `DELETE /api/purchase/[id]` - 구입 항목 삭제

### 일정 체크리스트 API

- `GET /api/schedule` - 모든 일정 조회
- `POST /api/schedule` - 새로운 일정 생성
- `GET /api/schedule/[id]` - 특정 일정 조회
- `PUT /api/schedule/[id]` - 일정 수정
- `DELETE /api/schedule/[id]` - 일정 삭제

## 배포 (Vercel)

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인하세요.
2. GitHub 저장소를 연결하세요.
3. 프로젝트를 생성하세요.

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. 배포

GitHub에 코드를 푸시하면 자동으로 배포됩니다.

## 프로젝트 구조

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── purchase/           # 구입 체크리스트 API
│   │   └── schedule/           # 일정 체크리스트 API
│   └── page.tsx               # 메인 페이지
├── features/                   # 기능별 컴포넌트
│   ├── checklist/             # 구입 체크리스트
│   └── schedule/              # 일정 체크리스트
├── shared/                    # 공통 컴포넌트 및 유틸리티
│   ├── api/                   # API 호출 함수
│   ├── components/            # 공통 컴포넌트
│   └── stores/                # Zustand 스토어
├── lib/                       # 라이브러리 설정
│   ├── prisma.ts             # Prisma 클라이언트
│   └── supabase.ts           # Supabase 클라이언트
└── types/                     # TypeScript 타입 정의
    └── api.ts                # API 타입
```

## 개발 가이드

### 새로운 기능 추가

1. API 엔드포인트 추가: `src/app/api/` 폴더에 route.ts 파일 생성
2. API 호출 함수 추가: `src/shared/api/` 폴더에 함수 추가
3. 타입 정의: `src/types/api.ts`에 타입 추가
4. 스토어 업데이트: `src/shared/stores/` 폴더의 스토어 수정

### 스타일링

- TailwindCSS 클래스를 사용하세요.
- 컴포넌트별로 스타일을 모듈화하세요.

## 라이선스

MIT License
