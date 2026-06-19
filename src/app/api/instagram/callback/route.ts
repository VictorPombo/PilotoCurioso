import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/admin/editor?error=instagram_auth_failed', request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID!;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/instagram/callback`;

  try {
    // 1. Exchange code for short-lived token
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code.replace('#_', '')); // Instagram appends #_ to the code sometimes

    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData,
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Short-lived token error:', tokenData);
      return NextResponse.redirect(new URL('/admin/editor?error=instagram_exchange_failed', request.url));
    }

    // 2. Exchange short-lived token for long-lived token
    const longLivedRes = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${tokenData.access_token}`);
    const longLivedData = await longLivedRes.json();

    if (!longLivedRes.ok) {
      console.error('Long-lived token error:', longLivedData);
      return NextResponse.redirect(new URL('/admin/editor?error=instagram_long_lived_failed', request.url));
    }

    const finalToken = longLivedData.access_token;

    // 3. Save token
    // For local development, we save it to a JSON file.
    // In production, this should be saved to Supabase (site_settings).
    const tokenPath = path.join(process.cwd(), '.instagram-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify({ access_token: finalToken, updated_at: new Date().toISOString() }));

    return NextResponse.redirect(new URL('/admin/editor?success=instagram_connected', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/admin/editor?error=instagram_internal_error', request.url));
  }
}
