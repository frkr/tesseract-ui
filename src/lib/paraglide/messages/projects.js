/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_projects = /** @type {(inputs: {}) => string} */ () => {
	return `Projetos`
};

const en_projects = /** @type {(inputs: {}) => string} */ () => {
	return `Projects`
};

const es_projects = /** @type {(inputs: {}) => string} */ () => {
	return `Proyectos`
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
export const projects = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.projects(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("projects", locale)
	if (locale === "pt-br") return pt_br_projects(inputs)
	if (locale === "en") return en_projects(inputs)
	return es_projects(inputs)
};