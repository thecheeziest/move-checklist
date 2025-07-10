import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/schedule - 모든 일정 조회
export async function GET() {
  try {
    const items = await prisma.scheduleItem.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ success: true, data: items });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/schedule - 새로운 일정 생성
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // 기존 모든 항목 order +1
    await prisma.scheduleItem.updateMany({
      data: { order: { increment: 1 } },
    });
    // 새 항목 order=0
    const item = await prisma.scheduleItem.create({ data: { ...data, order: 0 } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/schedule/order - 순서 일괄 변경
export async function PATCH(req: Request) {
  try {
    const { ids } = await req.json(); // { ids: string[] }
    if (!Array.isArray(ids)) {
      return NextResponse.json({ success: false, error: 'ids 배열이 필요합니다.' }, { status: 400 });
    }
    // 순서대로 order 값 부여
    for (let i = 0; i < ids.length; i++) {
      await prisma.scheduleItem.update({ where: { id: ids[i] }, data: { order: i } });
    }
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 