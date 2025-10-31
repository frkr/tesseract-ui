/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_starred = /** @type {(inputs: {}) => string} */ () => {
	return `Favoritos`
};

const en_starred = /** @type {(inputs: {}) => string} */ () => {
	return `Starred`
};

const es_starred = /** @type {(inputs: {}) => string} */ () => {
	return `Favoritos`
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
export const starred = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.starred(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("starred", locale)
	if (locale === "pt-br") return pt_br_starred(inputs)
	if (locale === "en") return en_starred(inputs)
	return es_starred(inputs)
};