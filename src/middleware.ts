import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE_KEY = 'soft99_admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLogin = pathname.startsWith('/admin/login');
  const hasAuthCookie = Boolean(request.cookies.get(ADMIN_COOKIE_KEY)?.value);

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!hasAuthCookie && !isLogin) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAuthCookie && isLogin) {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
