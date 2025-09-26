// src/app/api/make-call/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// In-memory store for rate limiting
const ipCallTimestamps = new Map<string, number>();

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';

  const lastCallTimestamp = ipCallTimestamps.get(ip);
  const now = Date.now();

  if (lastCallTimestamp && now - lastCallTimestamp < 60 * 1000) {
    return NextResponse.json({ error: 'You can only make one call per minute.' }, { status: 429 });
  }

  const { to_number } = await request.json();

  if (!to_number) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    console.error('ElevenLabs API key is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/convai/sip-trunk/outbound-call", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "agent_id": "agent_8901k2cjdyj9ew08tmznm6h8n56r",
        "agent_phone_number_id": "phnum_3601k4pxd0csfzp9sphwse784xhd",
        "to_number": to_number
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ElevenLabs API error:', errorBody);
      return NextResponse.json({ error: 'Failed to initiate call' }, { status: response.status });
    }

    // If the call was successful, update the timestamp
    ipCallTimestamps.set(ip, now);

    const body = await response.json();
    return NextResponse.json(body);

  } catch (error) {
    console.error('Error making call:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}