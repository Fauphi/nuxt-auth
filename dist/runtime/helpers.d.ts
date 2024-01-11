import { DeepRequired } from 'ts-essentials';
import { SupportedAuthProviders, AuthProviders } from './types';
import { useRuntimeConfig } from '#imports';
export declare const isProduction: boolean;
export declare const getOriginAndPathnameFromURL: (url: string) => {
    origin: any;
    pathname: string | undefined;
};
/**
 * Get the backend configuration from the runtime config in a typed manner.
 *
 * @param runtimeConfig The runtime config of the application
 * @param type Backend type to be enforced (e.g.: `local`,`refresh` or `authjs`)
 */
export declare const useTypedBackendConfig: <T extends SupportedAuthProviders>(runtimeConfig: ReturnType<typeof useRuntimeConfig>, _type: T) => Extract<{
    type: "authjs";
    trustHost: boolean;
    defaultProvider: import("next-auth/providers").BuiltInProviderType | (string & Record<never, never>);
    addDefaultCallbackUrl: string | boolean;
}, {
    type: T;
}> | Extract<{
    type: "local";
    endpoints: {
        signIn: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        signOut: false | {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        signUp: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        getSession: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
    };
    pages: {
        login: string;
    };
    token: {
        signInResponseTokenPointer: string;
        type: string;
        headerName: string;
        maxAgeInSeconds: number;
        sameSiteAttribute: boolean | "lax" | "strict" | "none";
    };
    sessionDataType: {
        [x: string]: any | {
            [x: number]: string;
            [Symbol.iterator]: () => IterableIterator<string>;
            charAt: (pos: number) => string;
            charCodeAt: (index: number) => number;
            concat: (...strings: string[]) => string;
            indexOf: (searchString: string, position?: number | undefined) => number;
            lastIndexOf: (searchString: string, position?: number | undefined) => number;
            localeCompare: {
                (that: string): number;
                (that: string, locales?: string | string[] | undefined, options?: Intl.CollatorOptions | undefined): number;
            };
            match: {
                (regexp: string | RegExp): RegExpMatchArray | null;
                (matcher: {
                    [Symbol.match](string: string): RegExpMatchArray | null;
                }): RegExpMatchArray | null;
            };
            replace: {
                (searchValue: string | RegExp, replaceValue: string): string;
                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replaceValue: string): string;
                }, replaceValue: string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                }, replacer: (substring: string, ...args: any[]) => string): string;
            };
            search: {
                (regexp: string | RegExp): number;
                (searcher: {
                    [Symbol.search](string: string): number;
                }): number;
            };
            slice: (start?: number | undefined, end?: number | undefined) => string;
            split: {
                (separator: string | RegExp, limit?: number | undefined): string[];
                (splitter: {
                    [Symbol.split](string: string, limit?: number | undefined): string[];
                }, limit?: number | undefined): string[];
            };
            substring: (start: number, end?: number | undefined) => string;
            toLowerCase: () => string;
            toLocaleLowerCase: (locales?: string | string[] | undefined) => string;
            toUpperCase: () => string;
            toLocaleUpperCase: (locales?: string | string[] | undefined) => string;
            trim: () => string;
            readonly length: number;
            substr: (from: number, length?: number | undefined) => string;
            codePointAt: (pos: number) => number | undefined;
            includes: (searchString: string, position?: number | undefined) => boolean;
            endsWith: (searchString: string, endPosition?: number | undefined) => boolean;
            normalize: {
                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                (form?: string | undefined): string;
            };
            repeat: (count: number) => string;
            startsWith: (searchString: string, position?: number | undefined) => boolean;
            anchor: (name: string) => string;
            big: () => string;
            blink: () => string;
            bold: () => string;
            fixed: () => string;
            fontcolor: (color: string) => string;
            fontsize: {
                (size: number): string;
                (size: string): string;
            };
            italics: () => string;
            link: (url: string) => string;
            small: () => string;
            strike: () => string;
            sub: () => string;
            sup: () => string;
            padStart: (maxLength: number, fillString?: string | undefined) => string;
            padEnd: (maxLength: number, fillString?: string | undefined) => string;
            trimEnd: () => string;
            trimStart: () => string;
            trimLeft: () => string;
            trimRight: () => string;
            matchAll: (regexp: RegExp) => IterableIterator<RegExpMatchArray>;
            at: (index: number) => string | undefined;
            toString: () => string;
            valueOf: () => string;
        };
    };
}, {
    type: T;
}> | Extract<{
    endpoints: {
        signIn: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        signOut: false | {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        signUp: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        getSession: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
        refresh: {
            path: string;
            method: "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace";
        };
    };
    pages: {
        login: string;
    };
    token: {
        signInResponseTokenPointer: string;
        type: string;
        headerName: string;
        maxAgeInSeconds: number;
        sameSiteAttribute: boolean | "lax" | "strict" | "none";
    };
    sessionDataType: {
        [x: string]: any | {
            [x: number]: string;
            [Symbol.iterator]: () => IterableIterator<string>;
            charAt: (pos: number) => string;
            charCodeAt: (index: number) => number;
            concat: (...strings: string[]) => string;
            indexOf: (searchString: string, position?: number | undefined) => number;
            lastIndexOf: (searchString: string, position?: number | undefined) => number;
            localeCompare: {
                (that: string): number;
                (that: string, locales?: string | string[] | undefined, options?: Intl.CollatorOptions | undefined): number;
            };
            match: {
                (regexp: string | RegExp): RegExpMatchArray | null;
                (matcher: {
                    [Symbol.match](string: string): RegExpMatchArray | null;
                }): RegExpMatchArray | null;
            };
            replace: {
                (searchValue: string | RegExp, replaceValue: string): string;
                (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replaceValue: string): string;
                }, replaceValue: string): string;
                (searchValue: {
                    [Symbol.replace](string: string, replacer: (substring: string, ...args: any[]) => string): string;
                }, replacer: (substring: string, ...args: any[]) => string): string;
            };
            search: {
                (regexp: string | RegExp): number;
                (searcher: {
                    [Symbol.search](string: string): number;
                }): number;
            };
            slice: (start?: number | undefined, end?: number | undefined) => string;
            split: {
                (separator: string | RegExp, limit?: number | undefined): string[];
                (splitter: {
                    [Symbol.split](string: string, limit?: number | undefined): string[];
                }, limit?: number | undefined): string[];
            };
            substring: (start: number, end?: number | undefined) => string;
            toLowerCase: () => string;
            toLocaleLowerCase: (locales?: string | string[] | undefined) => string;
            toUpperCase: () => string;
            toLocaleUpperCase: (locales?: string | string[] | undefined) => string;
            trim: () => string;
            readonly length: number;
            substr: (from: number, length?: number | undefined) => string;
            codePointAt: (pos: number) => number | undefined;
            includes: (searchString: string, position?: number | undefined) => boolean;
            endsWith: (searchString: string, endPosition?: number | undefined) => boolean;
            normalize: {
                (form: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
                (form?: string | undefined): string;
            };
            repeat: (count: number) => string;
            startsWith: (searchString: string, position?: number | undefined) => boolean;
            anchor: (name: string) => string;
            big: () => string;
            blink: () => string;
            bold: () => string;
            fixed: () => string;
            fontcolor: (color: string) => string;
            fontsize: {
                (size: number): string;
                (size: string): string;
            };
            italics: () => string;
            link: (url: string) => string;
            small: () => string;
            strike: () => string;
            sub: () => string;
            sup: () => string;
            padStart: (maxLength: number, fillString?: string | undefined) => string;
            padEnd: (maxLength: number, fillString?: string | undefined) => string;
            trimEnd: () => string;
            trimStart: () => string;
            trimLeft: () => string;
            trimRight: () => string;
            matchAll: (regexp: RegExp) => IterableIterator<RegExpMatchArray>;
            at: (index: number) => string | undefined;
            toString: () => string;
            valueOf: () => string;
        };
    };
    type: "refresh";
    refreshOnlyToken: true;
    refreshToken: {
        signInResponseRefreshTokenPointer: string;
        maxAgeInSeconds: number;
    };
}, {
    type: T;
}>;
/**
 * Get a property from an object following the JSON Pointer spec.
 *
 * RFC / Standard: https://www.rfc-editor.org/rfc/rfc6901
 *
 * Implementation adapted from https://github.com/manuelstofer/json-pointer/blob/931b0f9c7178ca09778087b4b0ac7e4f505620c2/index.js#L48-L59
 *
 * @param obj
 * @param pointer
 */
export declare const jsonPointerGet: (obj: Record<string, any>, pointer: string) => string | Record<string, any>;
