/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Perfil`
};

const en_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Profile`
};

const es_profile = /** @type {(inputs: {}) => string} */ () => {
	return `Perfil`
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
export const profile = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.profile(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("profile", locale)
	if (locale === "pt-br") return pt_br_profile(inputs)
	if (locale === "en") return en_profile(inputs)
	return es_profile(inputs)
};