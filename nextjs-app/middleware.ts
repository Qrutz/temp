import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isEmployeeRoute = createRouteMatcher(['/employee(.*)']);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/role-selection(.*)',
  '/api/update-role(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  const currentPath = req.nextUrl.pathname;

  // Allow access to public routes
  if (isPublicRoute(req)) {
    // Redirect users with a role away from the role-selection page
    if (currentPath === '/role-selection' && role) {
      const redirectUrl = new URL(
        role === 'admin' ? '/admin' : '/employee',
        req.url
      );
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // If the user is not logged in, redirect to sign-in
  if (!sessionId) {
    const url = new URL('/sign-in', req.url);
    return NextResponse.redirect(url);
  }

  // If the user is logged in but has no role, redirect to the role-selection page
  if (!role) {
    const url = new URL('/role-selection', req.url);
    if (currentPath !== '/role-selection') {
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); // Allow access to role-selection
  }

  // Redirect users with roles accessing the root path to their respective dashboards
  if (currentPath === '/') {
    const redirectUrl = new URL(
      role === 'admin' ? '/admin' : '/employee',
      req.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Protect admin routes
  if (isAdminRoute(req) && role !== 'admin') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  // Protect employee routes
  if (isEmployeeRoute(req) && role !== 'employee') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
