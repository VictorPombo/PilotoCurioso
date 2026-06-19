import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/instagram/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'INSTAGRAM_CLIENT_ID not configured' }, { status: 500 });
  }

  const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
  
  return NextResponse.redirect(url);
}
