// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			user: import('$lib/utils/auth').SessionValidationResult['user'];
			session: import('$lib/utils/auth').SessionValidationResult['session'];
			groups: import('$lib/utils/auth').SessionValidationResult['groups'];
		}
	} // interface Error {}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};
