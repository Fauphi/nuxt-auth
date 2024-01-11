import { parseURL } from "ufo";
export const isProduction = process.env.NODE_ENV === "production";
export const getOriginAndPathnameFromURL = (url) => {
  const { protocol, host, pathname } = parseURL(url);
  let origin;
  if (host && protocol) {
    origin = `${protocol}//${host}`;
  }
  const pathname_ = pathname.length > 0 ? pathname : void 0;
  return {
    origin,
    pathname: pathname_
  };
};
export const useTypedBackendConfig = (runtimeConfig, _type) => {
  return runtimeConfig.public.auth.provider;
};
export const jsonPointerGet = (obj, pointer) => {
  const unescape = (str) => str.replace(/~1/g, "/").replace(/~0/g, "~");
  const parse = (pointer2) => {
    if (pointer2 === "") {
      return [];
    }
    if (pointer2.charAt(0) !== "/") {
      throw new Error("Invalid JSON pointer: " + pointer2);
    }
    return pointer2.substring(1).split(/\//).map(unescape);
  };
  const refTokens = Array.isArray(pointer) ? pointer : parse(pointer);
  for (let i = 0; i < refTokens.length; ++i) {
    const tok = refTokens[i];
    if (!(typeof obj === "object" && tok in obj)) {
      throw new Error("Invalid reference token: " + tok);
    }
    obj = obj[tok];
  }
  return obj;
};
