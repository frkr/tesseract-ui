/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_termsofservice2 = /** @type {(inputs: {}) => string} */ () => {
	return `Ao clicar em continuar, você concorda com nossos`
};

const en_termsofservice2 = /** @type {(inputs: {}) => string} */ () => {
	return `By clicking continue, you agree to our`
};

const es_termsofservice2 = /** @type {(inputs: {}) => string} */ () => {
	return `Al hacer clic en continuar, aceptas nuestros`
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
const termsofservice2 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.termsofservice2(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("termsofservice2", locale)
	if (locale === "pt-br") return pt_br_termsofservice2(inputs)
	if (locale === "en") return en_termsofservice2(inputs)
	return es_termsofservice2(inputs)
};
export { termsofservice2 as "termsOfService" }