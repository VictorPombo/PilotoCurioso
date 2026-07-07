import { NextResponse } from 'next/server';

export const revalidate = 10800; // Cache for 3 hours (10800 seconds)

export async function GET() {

  let token = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const fs = require('fs');
    const path = require('path');
    const tokenPath = path.join(process.cwd(), '.instagram-token.json');
    if (fs.existsSync(tokenPath)) {
      const data = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      if (data.access_token) {
        token = data.access_token;
      }
    }
  } catch (e) {
    console.error('Error reading token file', e);
  }

  // Fallback se não houver token ou se a API falhar
  const mockFallback = [
    {
      id: 'mock-1',
      media_url: 'https://images.unsplash.com/photo-1541445903908-11f879ab6ce9?q=80&w=600&auto=format&fit=crop',
      caption: 'Bastidores exclusivos do GP de Mônaco! Acompanhe a preparação da Ferrari. 🏎️💨 #F1 #Bastidores',
      permalink: 'https://instagram.com/piloto__curioso',
      timestamp: new Date().toISOString(),
      media_type: 'VIDEO',
    },
    {
      id: 'mock-2',
      media_url: 'https://images.unsplash.com/photo-1610884447640-42b8ec61a933?q=80&w=600&auto=format&fit=crop',
      caption: 'Você sabia que o volante de um F1 custa mais que um carro popular? Explico no vídeo! 🤯',
      permalink: 'https://instagram.com/piloto__curioso',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      media_type: 'VIDEO',
    },
    {
      id: 'mock-3',
      media_url: 'https://images.unsplash.com/photo-1533036832662-7e04c5dc5f2c?q=80&w=600&auto=format&fit=crop',
      caption: 'A evolução da aerodinâmica nos últimos 10 anos. Arrasta pro lado 👉',
      permalink: 'https://instagram.com/piloto__curioso',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      media_type: 'CAROUSEL_ALBUM',
    },
    {
      id: 'mock-4',
      media_url: 'https://images.unsplash.com/photo-1510227289408-7243c965b736?q=80&w=600&auto=format&fit=crop',
      caption: 'Mais um recorde quebrado nas pistas! O que acharam da corrida de hoje? 🏆🔥',
      permalink: 'https://instagram.com/piloto__curioso',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      media_type: 'IMAGE',
    },
  ];

  if (!token) {
    console.warn('INSTAGRAM_ACCESS_TOKEN not set. Returning fallback data.');
    return NextResponse.json({ data: mockFallback });
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=3`;
    const response = await fetch(url, { next: { revalidate: 10800 } });

    if (!response.ok) {
      console.error(`Instagram API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ data: mockFallback });
    }

    const data = await response.json();
    return NextResponse.json({ data: data.data || mockFallback });
  } catch (error) {
    console.error('Failed to fetch Instagram feed:', error);
    return NextResponse.json({ data: mockFallback });
  }
}
