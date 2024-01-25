import { createNextAuthMiddleware } from 'nextjs-basic-auth-middleware'

// Read environment variables for basic auth credentials
const username = process.env.BASIC_AUTH_USERNAME;
const password = process.env.BASIC_AUTH_PASSWORD;

// Check if both username and password are available
if (!username || !password) {
    throw new Error("Basic authentication credentials are not set.");
}

const options = {
    pathname: '/(.*)',
    users: [
        { name: username, password: password },
    ],
};

export const middleware = createNextAuthMiddleware(options);

export const config = {
    matcher: ['/(.*)'],
}