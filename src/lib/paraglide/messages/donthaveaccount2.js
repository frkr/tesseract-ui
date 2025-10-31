/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_donthaveaccount2 = /** @type {(inputs: {}) => string} */ () => {
	return `Não tem uma conta?`
};

const en_donthaveaccount2 = /** @type {(inputs: {}) => string} */ () => {
	return `Don't have an account?`
};

const es_donthaveaccount2 = /** @type {(inputs: {}) => string} */ () => {
	return `¿No tienes una cuenta?`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{}} inputs
* @param {{ locale?: "pt-br" | "en" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
const donthaveaccount2 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.donthaveaccount2(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("donthaveaccount2", locale)
	if (locale === "pt-br") return pt_br_donthaveaccount2(inputs)
	if (locale === "en") return en_donthaveaccount2(inputs)
	return es_donthaveaccount2(inputs)
};
export { donthaveaccount2 as "dontHaveAccount" }