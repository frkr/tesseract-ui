import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';

const PROTOCOL_URL = env.NODE_ENV === 'development' ? 'http://' : 'https://';

// Build callback URL with proper validation
let callbackHost: string;

if (env.NODE_ENV === 'development') {
	// Development: use localhost fallback
	callbackHost = 'localhost:5173';
} else {
	// Production/Preview: prioritize custom domain, then explicit host, then Vercel's automatic URLs
	if (env.NEXT_PUBLIC_CUSTOM_DOMAIN) {
		callbackHost = env.NEXT_PUBLIC_CUSTOM_DOMAIN;
	} else if (env.APP_HOST) {
		callbackHost = env.APP_HOST;
	} else if (env.VERCEL_URL) {
		// VERCEL_URL is available in both preview and production environments
		callbackHost = env.VERCEL_URL;
	} else if (env.VERCEL_PROJECT_PRODUCTION_URL) {
		// Fallback for older Vercel versions or production-only scenarios
		callbackHost = env.VERCEL_PROJECT_PRODUCTION_URL;
	} else {
		throw new Error(
			'Production deployment requires either NEXT_PUBLIC_CUSTOM_DOMAIN, APP_HOST, VERCEL_URL, or VERCEL_PROJECT_PRODUCTION_URL environment variable to be set'
		);
	}
}

const GOOGLE_URL_CALLBACK = PROTOCOL_URL + callbackHost + '/user/login/google/callback';

const googleClient = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_URL_CALLBACK);

export default googleClient;
