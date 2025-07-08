import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreatePurchaseRequest, ApiResponse, ApiListResponse, PurchaseResponse } from '@/types/api';

// GET /api/purchase - 모든 구입 항목 조회
export async function GET() {
  try {
    const items = await prisma.purchaseItem.findMany({ orderBy: { createdAt: 'desc' } });
    
    // BigInt를 문자열로 변환하여 반환
    const serializedItems = items.map((item: any) => ({
      ...item,
      price: item.price.toString(),
      purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : null,
    }));
    
    return NextResponse.json({ success: true, data: serializedItems });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST /api/purchase - 새로운 구입 항목 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 필수 필드 검증
    if (!body.category || !body.title || body.price === undefined || body.isPurchased === undefined) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

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

    const data = {
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

    const item = await prisma.purchaseItem.create({ data });
    
    // BigInt를 문자열로 변환하여 반환
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...item, 
        price: item.price.toString(),
        purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : null,
      } 
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
} 