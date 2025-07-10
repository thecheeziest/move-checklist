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
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': url,
      }
    });
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `미리보기 요청이 거부되었습니다 (status: ${res.status})` }, { status: 500 });
    }
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
  } catch (e) {
    return NextResponse.json({ success: false, error: 'OpenGraph 데이터 파싱 실패 또는 서버에서 차단되었습니다.' }, { status: 500 });
  }
} 