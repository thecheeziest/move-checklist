import { ImageResponse } from '@vercel/og';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '체크리스트';
  const width = parseInt(searchParams.get('width') || '1200', 10);
  const height = parseInt(searchParams.get('height') || '630', 10);
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: width < 600 ? 32 : 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </div>
    ),
    {
      width,
      height,
    }
  );
} 