import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? '설정됨' : '설정되지 않음',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '설정되지 않음',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '설정됨' : '설정되지 않음',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '설정됨' : '설정되지 않음',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '설정됨' : '설정되지 않음',
  };

  return NextResponse.json({
    message: '환경변수 상태',
    envVars,
    timestamp: new Date().toISOString(),
  });
} 