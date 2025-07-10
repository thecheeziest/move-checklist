import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET /api/purchase - 모든 구입 항목 조회
export async function GET() {
  try {
    const items = await prisma.purchaseItem.findMany({ orderBy: { order: 'asc' } });
    // BigInt를 문자열로 변환하여 반환
    const serializedItems = items.map((item) => ({
      ...item,
      price: item.price.toString(),
      purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : null,
    }));
    return NextResponse.json({ success: true, data: serializedItems });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/purchase - 새로운 구입 항목 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // 기존 모든 항목 order +1
    await prisma.purchaseItem.updateMany({
      data: { order: { increment: 1 } },
    });
    // 새 항목 order=0
    const cleanPrice = String(body.price).replace(/[^\d]/g, '');
    let priceBigInt: bigint;
    try {
      priceBigInt = BigInt(cleanPrice);
    } catch {
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
      order: 0,
    };
    const item = await prisma.purchaseItem.create({ data });
    return NextResponse.json({ 
      success: true, 
      data: { 
        ...item, 
        price: item.price.toString(),
        purchasedDate: item.purchasedDate ? item.purchasedDate.toISOString().split('T')[0] : null,
      } 
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 

// PATCH /api/purchase/order - 순서 일괄 변경
export async function PATCH(req: Request) {
  try {
    const { ids } = await req.json(); // { ids: string[] }
    if (!Array.isArray(ids)) {
      return NextResponse.json({ success: false, error: 'ids 배열이 필요합니다.' }, { status: 400 });
    }
    // 순서대로 order 값 부여
    for (let i = 0; i < ids.length; i++) {
      await prisma.purchaseItem.update({ where: { id: ids[i] }, data: { order: i } });
    }
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 