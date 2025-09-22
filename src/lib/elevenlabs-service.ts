/**
 * Client-side service for making calls via the API route
 */

/**
 * Initiates an outbound call to the specified phone number via API
 * @param phoneNumber - The phone number to call (in international format)
 * @returns Promise that resolves when the call is initiated
 */
export async function makeOutboundCall(phoneNumber: string): Promise<void> {
  try {
    const response = await fetch('/api/make-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to initiate call');
    }

    console.log('Call initiated successfully');
  } catch (error) {
    console.error('Error making outbound call:', error);
    throw error;
  }
}

/**
 * Validates if a phone number is in a valid format
 * @param phoneNumber - The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return false;
  }

  // Clean phone number
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Basic validation: should be at least 7 digits (minimum for local numbers)
  // and at most 15 digits (international standard)
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(cleaned);
}
