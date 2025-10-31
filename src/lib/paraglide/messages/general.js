/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_general = /** @type {(inputs: {}) => string} */ () => {
	return `Geral`
};

const en_general = /** @type {(inputs: {}) => string} */ () => {
	return `General`
};

const es_general = /** @type {(inputs: {}) => string} */ () => {
	return `General`
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
export const general = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.general(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("general", locale)
	if (locale === "pt-br") return pt_br_general(inputs)
	if (locale === "en") return en_general(inputs)
	return es_general(inputs)
};