import { type NextRequest, NextResponse } from 'next/server';

export function proxy(_request: NextRequest): NextResponse {
  // TODO: Add authentication check
  // TODO: Add access level verification
  // TODO: Verify session exists
  // TODO: Route guards for premium modes
  // TODO: Redirect unauthenticated users

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes we want to handle publicly
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
