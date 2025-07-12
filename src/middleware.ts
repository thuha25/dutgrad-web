import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from './lib/constants';

const publicRoutes = [
  APP_ROUTES.LOGIN, 
  APP_ROUTES.REGISTER, 
  '/forgot-password', 
  '/auth/callback',
  '/auth/success'
];

const protectedRoutes = [
  APP_ROUTES.DASHBOARD, 
  APP_ROUTES.PROFILE, 
  APP_ROUTES.SPACES.PUBLIC,
  APP_ROUTES.SPACES.MINE,
  '/settings'
];

const ignoredRoutes = [
  '/_next', 
  '/api', 
  '/favicon.ico',
  '/auth/exchange-state'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (ignoredRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth-token')?.value;
  
  const hasSession = request.cookies.get('has-session')?.value === 'true';
  
  const isAuthenticated = !!token || hasSession;

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }

  if (publicRoutes.some(route => pathname === route) && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/auth/register', 
    '/forgot-password',
    '/auth/callback',
    '/auth/success',
    '/dashboard/:path*',
    '/profile/:path*',
    '/spaces/:path*',
    '/settings/:path*'
  ]
};
