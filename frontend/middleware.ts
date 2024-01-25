import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: '/', // Apply the middleware to all routes
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const validUser = process.env.BASIC_AUTH_USERNAME;
    const validPwd = process.env.BASIC_AUTH_PASSWORD;

    if (user === validUser && pwd === validPwd) {
      return NextResponse.next(); // Continue with the request if authentication is valid
    }
  }

  // Return a custom error message when authentication fails
  return new Response('Falsche Logindaten', {
    status: 401, // HTTP status code for Unauthorized
    headers: {
      'Content-Type': 'text/plain', // Set the content type to plain text
    },
  });
}
