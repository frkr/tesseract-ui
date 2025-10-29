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
	if (env.VERCEL_PROJECT_PRODUCTION_URL) {
		callbackHost = env.VERCEL_PROJECT_PRODUCTION_URL;
	} else if (env.APP_HOST) {
		callbackHost = env.APP_HOST;
	} else {
		throw new Error(
			'Production deployment requires either VERCEL_PROJECT_PRODUCTION_URL or APP_HOST environment variable to be set'
		);
	}
}

const GOOGLE_URL_CALLBACK = PROTOCOL_URL + callbackHost + '/user/login/google/callback';

const googleClient = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_URL_CALLBACK);

export default googleClient;
