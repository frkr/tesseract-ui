/* eslint-disable */
import { getLocale, trackMessageCall, experimentalMiddlewareLocaleSplitting, isServer } from '../runtime.js';

const pt_br_notifications = /** @type {(inputs: {}) => string} */ () => {
	return `Notificações`
};

const en_notifications = /** @type {(inputs: {}) => string} */ () => {
	return `Notifications`
};

const es_notifications = /** @type {(inputs: {}) => string} */ () => {
	return `Notificaciones`
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
export const notifications = (inputs = {}, options = {}) => {
	if (experimentalMiddlewareLocaleSplitting && isServer === false) {
		return /** @type {any} */ (globalThis).__paraglide_ssr.notifications(inputs) 
	}
	const locale = options.locale ?? getLocale()
	trackMessageCall("notifications", locale)
	if (locale === "pt-br") return pt_br_notifications(inputs)
	if (locale === "en") return en_notifications(inputs)
	return es_notifications(inputs)
};