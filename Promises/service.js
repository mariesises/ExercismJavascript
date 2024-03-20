/// <reference path="./global.d.ts" />
// @ts-nocheck
//
// The lines above enable type checking for this file. Various IDEs interpret
// the @ts-check and reference directives. Together, they give you helpful
// autocompletion when implementing this exercise. You don't need to understand
// them in order to use it.
//
// In your own projects, files, and code, you can play with @ts-check as well.

export class TranslationService {
    /**
     * Creates a new service
     * @param {ExternalApi} api the original api
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Attempts to retrieve the translation for the given text.
     *
     * - Returns whichever translation can be retrieved, regardless the quality
     * - Forwards any error from the translation api
     *
     * @param {string} text
     * @returns {Promise<string>}
     */
    free(text) {
        return this.api.fetch(text)
            .then(res => res.translation)
            .catch(err => { throw err; });
    }

    /**
     * Batch translates the given texts using the free service.
     *
     * - Resolves all the translations (in the same order), if they all succeed
     * - Rejects with the first error that is encountered
     * - Rejects with a BatchIsEmpty error if no texts are given
     *
     * @param {string[]} texts
     * @returns {Promise<string[]>}
     */
    batch(texts) {
        if (!texts.length) {
            return Promise.reject(new BatchIsEmpty());
        }
        return Promise.all(texts.map(text => this.free(text)));
    }

    /**
     * Requests the service for some text to be translated.
     *
     * Note: the request service is flaky, and it may take up to three times for
     *       it to accept the request.
     *
     * @param {string} text
     * @returns {Promise<void>}
     */
    request(text) {
        const api = this.api;
        function requestPromise(txt) {
            return new Promise((resolve, reject) => {
                api.request(text, err => (err ? reject(err) : resolve()));
            });
        }
        return requestPromise(text)
            .catch(() => requestPromise(text))
            .catch(() => requestPromise(text));

    }

    /**
     * Retrieves the translation for the given text
     *
     * - Rejects with an error if the quality can not be met
     * - Requests a translation if the translation is not available, then retries
     *
     * @param {string} text
     * @param {number} minimumQuality
     * @returns {Promise<string>}
     */
    premium(text, minimumQuality) {
        return this.api
            .fetch(text)
            .catch(() => {
                return this.request(text)
                    .then(() => this.api.fetch(text));
            })
            .then(res => {
                if (res.quality < minimumQuality) {
                    throw new QualityThresholdNotMet(text);
                }
                return res.translation;
            });
    }
}

/**
 * This error is used to indicate a translation was found, but its quality does
 * not meet a certain threshold. Do not change the name of this error.
 */
export class QualityThresholdNotMet extends Error {
    /**
     * @param {string} text
     */
    constructor(text) {
        super(
            `
  The translation of ${text} does not meet the requested quality threshold.
      `.trim(),
        );

        this.text = text;
    }
}

/**
 * This error is used to indicate the batch service was called without any
 * texts to translate (it was empty). Do not change the name of this error.
 */
export class BatchIsEmpty extends Error {
    constructor() {
        super(
            `
  Requested a batch translation, but there are no texts in the batch.
      `.trim(),
        );
    }
}





import { AbusiveClientError, NotAvailable, Untranslatable } from './errors';

const mutex = { current: false };

/**
 * @typedef {{ translation: string, quality: number }} Translation
 * @typedef {Record<string, Array<null | Translation>>} TranslatableValues
 *
 */
export class ExternalApi {
    /**
     * @param {Readonly<TranslatableValues>} values
     */
    constructor(values = {}) {
        /** @type {TranslatableValues} */
        this.values = JSON.parse(JSON.stringify(values));
    }

    /**
     * Register a word for translation
     *
     * @param {string} value
     * @param {string | null} translation
     * @param {number | undefined} quality
     *
     * @returns {this}
     */
    register(value, translation, quality = undefined) {
        if (typeof this.values[value] === 'undefined') {
            this.values[value] = [];
        }

        this.values[value].push(translation ? { translation, quality } : null);
        return this;
    }

    /**
     * @param {string} text
     * @returns {Promise<Translation>}
     */
    fetch(text) {
        if (typeof text !== 'string') {
            throw new BadRequest(
                `Expected text when calling fetch(text), actual ${typeof text}.`,
            );
        }

        // Check if client is banned
        if (mutex.current) {
            return rejectWithRandomDelay(new AbusiveClientError());
        }

        if (this.values[text] && this.values[text][0]) {
            return resolveWithRandomDelay(this.values[text][0]);
        }

        if (this.values[text]) {
            return rejectWithRandomDelay(new NotAvailable(text));
        }

        return rejectWithRandomDelay(new Untranslatable());
    }

    /**
     * @param {string} text
     * @param {(err?: Error) => void} callback
     */
    request(text, callback) {
        if (typeof text !== 'string') {
            throw new BadRequest(
                `Expected string text when calling request(text, callback), actual ${typeof text}.`,
            );
        }

        if (typeof callback !== 'function') {
            throw new BadRequest(
                `Expected callback function when calling request(text, callback), actual ${typeof callback}.`,
            );
        }

        if (this.values[text] && this.values[text][0]) {
            mutex.current = true;
            callback(new AbusiveClientError());
            return;
        }

        if (this.values[text]) {
            this.values[text].shift();

            // If it's now available, yay, otherwise, nay
            setTimeout(
                () => callback(this.values[text][0] ? undefined : makeRandomError()),
                1,
            );
            return;
        }

        callback(new Untranslatable());
    }
}

function resolveWithRandomDelay(value) {
    const timeout = Math.random() * 100;
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), timeout);
    });
}

function rejectWithRandomDelay(value) {
    const timeout = Math.random() * 100;
    return new Promise((_, reject) => {
        setTimeout(() => reject(value), timeout);
    });
}

function makeRandomError() {
    return new Error(`Error code ${Math.ceil(Math.random() * 10000)}`);
}

class BadRequest extends Error {
    constructor(message) {
        super(message);
    }
}





export class NotAvailable extends Error {
    constructor(text) {
        super(
            `
  The requested text "${text}" has not been translated yet.
      `.trim(),
        );
    }
}

export class AbusiveClientError extends Error {
    constructor() {
        super(
            `
  Your client has been rejected because of abusive behaviour.
  
  naDevvo’ yIghoS!
      `.trim(),
        );
    }
}

export class Untranslatable extends Error {
    constructor() {
        super('jIyajbe’');
    }
}





/**
 * These are the shapes of the external service', the return values and the
 * functions. Don't change these. In various IDEs, such as vscode, this will add
 * type information on the fly
 */

interface ExternalApi {
    fetch: fetchTranslation;
    request: requestTranslation;
}

interface Translation {
    translation: string;
    quality: number;
}

type fetchTranslation = (text: string) => Promise<Translation>;
type requestTranslation = (
    text: string,
    callback: (err?: Error) => void,
) => void;