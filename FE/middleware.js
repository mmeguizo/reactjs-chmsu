import { NextResponse } from 'next/server';
import jwt_decode from 'jwt-decode';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const token = request.cookies.get('token');
  const { origin } = request.nextUrl;
  const url = request.url;
  if (!token) return NextResponse.redirect(`${origin}`);
  const { role } = jwt_decode(token);
  const routes = [
    url.startsWith(`${origin}/admin`) && role !== 'admin',
    url.startsWith(`${origin}/foster`) && role !== 'foster',
    url.startsWith(`${origin}/socialworker`) && role !== 'socialworker',
  ];
  const redirect =
    role === 'socialworker'
      ? 'accounts'
      : role === 'volunteer'
      ? 'schedules'
      : 'dashboard';
  if (routes[0] || routes[1] || routes[2]) {
    return NextResponse.redirect(`${origin}/${role}/${redirect}`);
  }
}

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/accounts',
    '/admin/childrens',
    '/socialworker/childrens',
    '/admin/visitations',
    '/foster/dashboard',
    '/foster/schedule',
    '/volunteer/schedules',
    // '/foster/childrens',
    '/admin/history',
    '/admin/monitoring',
    '/socialworker/accounts',
  ],
};
