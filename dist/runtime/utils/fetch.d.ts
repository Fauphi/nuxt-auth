import { useNuxtApp } from '#imports';
export declare const _fetch: <T>(nuxt: ReturnType<typeof useNuxtApp>, path: string, fetchOptions?: Parameters<typeof $fetch>[1]) => Promise<T>;
