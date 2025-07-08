import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdatePurchaseRequest, ApiResponse, PurchaseResponse } from '@/types/api';

// GET /api/purchase/[id] - 특정 구입 항목 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.purchaseItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Purchase item not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<PurchaseResponse> = {
      success: true,
      data: {
        id: item.id,
        category: item.category,
        brand: item.brand || undefined,
        title: item.title,
        price: item.price.toString(),
        purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : undefined,
        isPurchased: item.isPurchased,
        option: item.option || undefined,
        memo: item.memo || undefined,
        url: item.url || undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching purchase item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase item' },
      { status: 500 }
    );
  }
}

// PUT /api/purchase/[id] - 구입 항목 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdatePurchaseRequest = await request.json();

    console.log('PUT /api/purchase/[id] - Request body:', body);
    console.log('PUT /api/purchase/[id] - ID:', id);

    // isPurchased가 true일 때 purchasedDate가 필수
    if (body.isPurchased && !body.purchasedDate) {
      return NextResponse.json(
        { success: false, error: '구매 완료 시 구매일은 필수입니다.' },
        { status: 400 }
      );
    }

    // price를 BigInt로 변환 (쉼표 제거 후)
    const cleanPrice = String(body.price).replace(/[^\d]/g, '');
    let priceBigInt: bigint;
    try {
      priceBigInt = BigInt(cleanPrice);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '가격 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const updateData = {
      category: body.category,
      brand: body.brand,
      title: body.title,
      price: priceBigInt,
      purchasedDate: body.purchasedDate ? new Date(body.purchasedDate) : null,
      isPurchased: body.isPurchased,
      option: body.option,
      memo: body.memo,
      url: body.url,
    };

    console.log('PUT /api/purchase/[id] - Update data:', updateData);

    const item = await prisma.purchaseItem.update({
      where: { id },
      data: updateData,
    });

    const response: ApiResponse<PurchaseResponse> = {
      success: true,
      data: {
        id: item.id,
        category: item.category,
        brand: item.brand || undefined,
        title: item.title,
        price: item.price.toString(),
        purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : undefined,
        isPurchased: item.isPurchased,
        option: item.option || undefined,
        memo: item.memo || undefined,
        url: item.url || undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating purchase item:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, error: `Failed to update purchase item: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// PATCH: 구입 항목 수정
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const item = await prisma.purchaseItem.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: item });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// DELETE: 구입 항목 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.purchaseItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting purchase item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete purchase item' },
      { status: 500 }
    );
  }
} 