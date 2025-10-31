/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_addteam1 = /** @type {(inputs: {}) => string} */ () => {
	return `Adicionar time`
};

const en_addteam1 = /** @type {(inputs: {}) => string} */ () => {
	return `Add team`
};

const es_addteam1 = /** @type {(inputs: {}) => string} */ () => {
	return `Agregar equipo`
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
const addteam1 = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.addteam1(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("addteam1", locale)
	if (locale === "pt-br") return pt_br_addteam1(inputs)
	if (locale === "en") return en_addteam1(inputs)
	return es_addteam1(inputs)
};
export { addteam1 as "addTeam" }