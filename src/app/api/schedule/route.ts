import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateScheduleRequest, ApiResponse, ApiListResponse, ScheduleResponse } from '@/types/api';

// GET /api/schedule - 모든 일정 조회
export async function GET() {
  try {
    const items = await prisma.scheduleItem.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: items });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST /api/schedule - 새로운 일정 생성
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.scheduleItem.create({ data });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
} 