import { NextRequest, NextResponse } from 'next/server';
import { auth as middleware } from './auth';

export { middleware }

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
