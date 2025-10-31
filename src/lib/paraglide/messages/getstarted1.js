/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_getstarted1 = /** @type {(inputs: {}) => string} */ () => {
	return `Começar`
};

const en_getstarted1 = /** @type {(inputs: {}) => string} */ () => {
	return `Get Started`
};

const es_getstarted1 = /** @type {(inputs: {}) => string} */ () => {
	return `Comenzar`
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
const getstarted1 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.getstarted1(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("getstarted1", locale)
	if (locale === "pt-br") return pt_br_getstarted1(inputs)
	if (locale === "en") return en_getstarted1(inputs)
	return es_getstarted1(inputs)
};
export { getstarted1 as "getStarted" }