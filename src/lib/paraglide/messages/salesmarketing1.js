/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_salesmarketing1 = /** @type {(inputs: {}) => string} */ () => {
	return `Vendas e Marketing`
};

const en_salesmarketing1 = /** @type {(inputs: {}) => string} */ () => {
	return `Sales & Marketing`
};

const es_salesmarketing1 = /** @type {(inputs: {}) => string} */ () => {
	return `Ventas y Marketing`
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
const salesmarketing1 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.salesmarketing1(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("salesmarketing1", locale)
	if (locale === "pt-br") return pt_br_salesmarketing1(inputs)
	if (locale === "en") return en_salesmarketing1(inputs)
	return es_salesmarketing1(inputs)
};
export { salesmarketing1 as "salesMarketing" }