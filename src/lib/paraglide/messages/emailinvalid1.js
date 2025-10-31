/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_emailinvalid1 = /** @type {(inputs: {}) => string} */ () => {
	return `Digite seu email como esse exemplo: davi@gmail.com`
};

const en_emailinvalid1 = /** @type {(inputs: {}) => string} */ () => {
	return `Enter your email like this example: davi@gmail.com`
};

const es_emailinvalid1 = /** @type {(inputs: {}) => string} */ () => {
	return `Ingresa tu email como este ejemplo: davi@gmail.com`
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
const emailinvalid1 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.emailinvalid1(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("emailinvalid1", locale)
	if (locale === "pt-br") return pt_br_emailinvalid1(inputs)
	if (locale === "en") return en_emailinvalid1(inputs)
	return es_emailinvalid1(inputs)
};
export { emailinvalid1 as "emailInvalid" }