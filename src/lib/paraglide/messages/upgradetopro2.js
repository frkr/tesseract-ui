/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_upgradetopro2 = /** @type {(inputs: {}) => string} */ () => {
	return `Atualizar para Pro`
};

const en_upgradetopro2 = /** @type {(inputs: {}) => string} */ () => {
	return `Upgrade to Pro`
};

const es_upgradetopro2 = /** @type {(inputs: {}) => string} */ () => {
	return `Actualizar a Pro`
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
const upgradetopro2 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.upgradetopro2(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("upgradetopro2", locale)
	if (locale === "pt-br") return pt_br_upgradetopro2(inputs)
	if (locale === "en") return en_upgradetopro2(inputs)
	return es_upgradetopro2(inputs)
};
export { upgradetopro2 as "upgradeToPro" }