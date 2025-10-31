/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_introduction = /** @type {(inputs: {}) => string} */ () => {
	return `Introdução`
};

const en_introduction = /** @type {(inputs: {}) => string} */ () => {
	return `Introduction`
};

const es_introduction = /** @type {(inputs: {}) => string} */ () => {
	return `Introducción`
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
export const introduction = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.introduction(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("introduction", locale)
	if (locale === "pt-br") return pt_br_introduction(inputs)
	if (locale === "en") return en_introduction(inputs)
	return es_introduction(inputs)
};