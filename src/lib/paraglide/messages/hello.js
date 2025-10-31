/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_hello = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Olá, ${i.name}`
};

const en_hello = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hello, ${i.name}`
};

const es_hello = /** @type {(inputs: { name: NonNullable<unknown> }) => string} */ (i) => {
	return `Hola, ${i.name}`
};

/**
* This function has been compiled by [Paraglide JS](https://inlang.com/m/gerre34r).
*
* - Changing this function will be over-written by the next build.
*
* - If you want to change the translations, you can either edit the source files e.g. `en.json`, or
* use another inlang app like [Fink](https://inlang.com/m/tdozzpar) or the [VSCode extension Sherlock](https://inlang.com/m/r7kp499g).
* 
* @param {{ name: NonNullable<unknown> }} inputs
* @param {{ locale?: "pt-br" | "en" | "es" }} options
* @returns {string}
*/
/* @__NO_SIDE_EFFECTS__ */
export const hello = (inputs, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.hello(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("hello", locale)
	if (locale === "pt-br") return pt_br_hello(inputs)
	if (locale === "en") return en_hello(inputs)
	return es_hello(inputs)
};