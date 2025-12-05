import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // This endpoint is kept for backward compatibility
  // but the main sharing now happens client-side via LinkedIn's share intent
  
  return NextResponse.json(
    { message: 'Sharing is now handled client-side. Open LinkedIn directly from the app.' },
    { status: 200 }
  );
}
