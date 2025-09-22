import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Configuration constants from environment variables
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'fake_api_key';
const AGENT_ID = process.env.AGENT_ID || 'fake_agent_id';
const AGENT_PHONE_NUMBER_ID = process.env.AGENT_PHONE_NUMBER_ID || 'fake_phone_number_id';

// Initialize the ElevenLabs client only if we have real API key
const client = ELEVENLABS_API_KEY !== 'fake_api_key' 
  ? new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY }) 
  : null;

/**
 * Validates if a phone number is in a valid format
 */
function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return false;
  }

  // Clean phone number
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Basic validation: should be at least 7 digits and at most 15 digits
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    // Check if we have real API configuration
    if (!client || ELEVENLABS_API_KEY === 'fake_api_key') {
      return NextResponse.json(
        { error: 'API not configured - missing environment variables' },
        { status: 500 }
      );
    }

    const { phoneNumber } = await request.json();

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Clean and format phone number
    const cleanedPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const formattedPhoneNumber = cleanedPhoneNumber.startsWith('+') 
      ? cleanedPhoneNumber 
      : `+${cleanedPhoneNumber}`;

    console.log('Initiating outbound call to:', formattedPhoneNumber);

    // Make the outbound call
    await client.conversationalAi.sipTrunk.outboundCall({
      agentId: AGENT_ID!,
      agentPhoneNumberId: AGENT_PHONE_NUMBER_ID!,
      toNumber: formattedPhoneNumber
    });

    console.log('Outbound call initiated successfully');

    return NextResponse.json({ success: true, message: 'Call initiated successfully' });
  } catch (error) {
    console.error('Error making outbound call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
