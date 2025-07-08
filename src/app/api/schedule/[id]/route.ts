import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateScheduleRequest, ApiResponse, ScheduleResponse } from '@/types/api';

// GET /api/schedule/[id] - 특정 일정 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.scheduleItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Schedule item not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<ScheduleResponse> = {
      success: true,
      data: {
        id: item.id,
        date: item.date,
        time: item.time || undefined,
        status: item.status,
        description: item.description,
        completed: item.status === '완료',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching schedule item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule item' },
      { status: 500 }
    );
  }
}

// PUT /api/schedule/[id] - 일정 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateScheduleRequest = await request.json();

    const item = await prisma.scheduleItem.update({
      where: { id },
      data: {
        date: body.date,
        time: body.time,
        status: body.status,
        description: body.description,
      },
    });

    const response: ApiResponse<ScheduleResponse> = {
      success: true,
      data: {
        id: item.id,
        date: item.date,
        time: item.time || undefined,
        status: item.status,
        description: item.description,
        completed: item.status === '완료',
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating schedule item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update schedule item' },
      { status: 500 }
    );
  }
}

// PATCH: 일정 수정
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.scheduleItem.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: item });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// DELETE: 일정 삭제
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.scheduleItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
} 