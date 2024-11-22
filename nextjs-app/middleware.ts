import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isEmployeeRoute = createRouteMatcher(['/employee(.*)']);
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/update-role(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  // Extract bypass query parameter
  const bypass = req.nextUrl.searchParams.get('bypass');

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Block access to /role-selection for unauthenticated users
  if (req.nextUrl.pathname === '/role-selection' && !sessionId) {
    const url = new URL('/sign-in', req.url);
    return NextResponse.redirect(url);
  }

  // Temporarily allow bypassing role checks
  if (bypass === 'true') {
    return NextResponse.next();
  }

  // Redirect users with roles away from /role-selection
  if (req.nextUrl.pathname === '/role-selection' && role) {
    const redirectUrl = new URL(
      role === 'admin' ? '/admin' : '/employee',
      req.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect users without a role to /role-selection
  if (!role) {
    const url = new URL('/role-selection', req.url);
    if (req.nextUrl.pathname !== '/role-selection') {
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protect employee routes
  if (isEmployeeRoute(req) && role !== 'employee') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Redirect users with roles from root to their respective dashboards
  if (req.nextUrl.pathname === '/') {
    const redirectUrl = new URL(
      role === 'admin' ? '/admin' : '/employee',
      req.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
