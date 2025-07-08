import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return NextResponse.json({ success: false, error: 'url 파라미터가 필요합니다.' }, { status: 400 });
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const ogTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
    const ogSiteName = $('meta[property="og:site_name"]').attr('content');
    return NextResponse.json({
      success: true,
      data: {
        title: ogTitle,
        image: ogImage,
        description: ogDescription,
        siteName: ogSiteName,
        url,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'OpenGraph 데이터 파싱 실패' }, { status: 500 });
  }
} 