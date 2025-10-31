/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_erroroccurred1 = /** @type {(inputs: {}) => string} */ () => {
	return `Ocorreu um erro`
};

const en_erroroccurred1 = /** @type {(inputs: {}) => string} */ () => {
	return `An error has occurred`
};

const es_erroroccurred1 = /** @type {(inputs: {}) => string} */ () => {
	return `Ha ocurrido un error`
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
const erroroccurred1 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.erroroccurred1(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("erroroccurred1", locale)
	if (locale === "pt-br") return pt_br_erroroccurred1(inputs)
	if (locale === "en") return en_erroroccurred1(inputs)
	return es_erroroccurred1(inputs)
};
export { erroroccurred1 as "errorOccurred" }