import { callWithNuxt } from "#app";
import { jsonPointerGet, useTypedBackendConfig } from "../../helpers.mjs";
import { useAuth as useLocalAuth } from "../refresh/useAuth.mjs";
import { _fetch } from "../../utils/fetch.mjs";
import { getRequestURLWN } from "../../utils/callWithNuxt.mjs";
import { useAuthState } from "./useAuthState.mjs";
import {
  navigateTo,
  nextTick,
  readonly,
  useNuxtApp,
  useRuntimeConfig
} from "#imports";
const signIn = async (credentials, signInOptions, signInParams) => {
  const nuxt = useNuxtApp();
  const { getSession } = useLocalAuth();
  const config = useTypedBackendConfig(useRuntimeConfig(), "refresh");
  const { path, method } = config.endpoints.signIn;
  const response = await _fetch(nuxt, path, {
    method,
    body: {
      ...credentials,
      ...signInOptions ?? {}
    },
    params: signInParams ?? {}
  });
  const extractedToken = jsonPointerGet(
    response,
    config.token.signInResponseTokenPointer
  );
  if (typeof extractedToken !== "string") {
    console.error(
      `Auth: string token expected, received instead: ${JSON.stringify(
        extractedToken
      )}. Tried to find token at ${config.token.signInResponseTokenPointer} in ${JSON.stringify(response)}`
    );
    return;
  }
  const extractedRefreshToken = jsonPointerGet(
    response,
    config.refreshToken.signInResponseRefreshTokenPointer
  );
  if (typeof extractedRefreshToken !== "string") {
    console.error(
      `Auth: string token expected, received instead: ${JSON.stringify(
        extractedRefreshToken
      )}. Tried to find token at ${config.refreshToken.signInResponseRefreshTokenPointer} in ${JSON.stringify(response)}`
    );
    return;
  }
  const extractedStelaceToken = jsonPointerGet(
    response,
    config.stelaceToken.signInResponseStelaceTokenPointer
  );
  if (typeof extractedStelaceToken !== "string") {
    console.error(
      `Auth: string token expected, received instead: ${JSON.stringify(
        extractedStelaceToken
      )}. Tried to find token at ${config.stelaceToken.signInResponseStelaceTokenPointer} in ${JSON.stringify(response)}`
    );
    return;
  }
  const extractedStelaceRefreshToken = jsonPointerGet(
    response,
    config.stelaceToken.signInResponseStelaceRefreshTokenPointer
  );
  if (typeof extractedStelaceRefreshToken !== "string") {
    console.error(
      `Auth: string token expected, received instead: ${JSON.stringify(
        extractedStelaceRefreshToken
      )}. Tried to find token at ${config.stelaceToken.signInResponseStelaceRefreshTokenPointer} in ${JSON.stringify(response)}`
    );
    return;
  }
  const { rawToken, rawRefreshToken, rawStelaceToken, rawStelaceRefreshToken } = useAuthState();
  rawToken.value = extractedToken;
  rawRefreshToken.value = extractedRefreshToken;
  rawStelaceToken.value = extractedStelaceToken;
  rawStelaceRefreshToken.value = extractedStelaceRefreshToken;
  await nextTick(getSession);
  const { callbackUrl, redirect = true } = signInOptions ?? {};
  if (redirect) {
    const urlToNavigateTo = callbackUrl ?? await getRequestURLWN(nuxt);
    return navigateTo(urlToNavigateTo);
  }
};
const refresh = async () => {
  const nuxt = useNuxtApp();
  const config = useTypedBackendConfig(useRuntimeConfig(), "refresh");
  const { path, method } = config.endpoints.refresh;
  const { getSession } = useLocalAuth();
  const {
    refreshToken,
    token,
    rawToken,
    rawRefreshToken,
    lastRefreshedAt,
    rawStelaceToken,
    rawStelaceRefreshToken
  } = useAuthState();
  const headers = new Headers({
    [config.token.headerName]: token.value
  });
  const response = await _fetch(nuxt, path, {
    method,
    headers,
    body: {
      refreshToken: refreshToken.value
    }
  });
  const extractedToken = jsonPointerGet(
    response,
    config.token.signInResponseTokenPointer
  );
  if (typeof extractedToken !== "string") {
    console.error(
      `Auth: string token expected, received instead: ${JSON.stringify(
        extractedToken
      )}. Tried to find token at ${config.token.signInResponseTokenPointer} in ${JSON.stringify(response)}`
    );
    return;
  }
  if (!config.refreshOnlyToken) {
    const extractedRefreshToken = jsonPointerGet(
      response,
      config.refreshToken.signInResponseRefreshTokenPointer
    );
    if (typeof extractedRefreshToken !== "string") {
      console.error(
        `Auth: string token expected, received instead: ${JSON.stringify(
          extractedRefreshToken
        )}. Tried to find token at ${config.refreshToken.signInResponseRefreshTokenPointer} in ${JSON.stringify(response)}`
      );
      return;
    } else {
      rawRefreshToken.value = extractedRefreshToken;
    }
  }
  if (!config.refreshOnlyToken) {
    const extractedStelaceToken = jsonPointerGet(
      response,
      config.stelaceToken.signInResponseStelaceTokenPointer
    );
    if (typeof extractedStelaceToken !== "string") {
      console.error(
        `Auth: string token expected, received instead: ${JSON.stringify(
          extractedStelaceToken
        )}. Tried to find token at ${config.stelaceToken.signInResponseStelaceTokenPointer} in ${JSON.stringify(response)}`
      );
      return;
    } else {
      rawStelaceToken.value = extractedStelaceToken;
    }
  }
  if (!config.refreshOnlyToken) {
    const extractedStelaceRefreshToken = jsonPointerGet(
      response,
      config.stelaceToken.signInResponseStelaceRefreshTokenPointer
    );
    if (typeof extractedStelaceRefreshToken !== "string") {
      console.error(
        `Auth: string token expected, received instead: ${JSON.stringify(
          extractedStelaceRefreshToken
        )}. Tried to find token at ${config.stelaceToken.signInResponseStelaceTokenPointer} in ${JSON.stringify(response)}`
      );
      return;
    } else {
      rawStelaceRefreshToken.value = extractedStelaceRefreshToken;
    }
  }
  rawToken.value = extractedToken;
  lastRefreshedAt.value = /* @__PURE__ */ new Date();
  await nextTick(getSession);
};
const signOut = async (signOutOptions) => {
  const nuxt = useNuxtApp();
  const runtimeConfig = await callWithNuxt(nuxt, useRuntimeConfig);
  const config = useTypedBackendConfig(runtimeConfig, "refresh-stelace");
  const {
    data,
    rawToken,
    token,
    rawRefreshToken,
    rawStelaceToken,
    rawStelaceRefreshToken
  } = await callWithNuxt(nuxt, useAuthState);
  const headers = new Headers({
    [config.token.headerName]: token.value
  });
  data.value = null;
  rawToken.value = null;
  rawRefreshToken.value = null;
  rawStelaceToken.value = null;
  rawStelaceRefreshToken.value = null;
  const signOutConfig = config.endpoints.signOut;
  let res;
  if (signOutConfig) {
    const { path, method } = config.endpoints.signOut;
    res = await _fetch(nuxt, path, { method, headers });
  }
  const { callbackUrl, redirect = true } = signOutOptions ?? {};
  if (redirect) {
    await navigateTo(callbackUrl ?? await getRequestURLWN(nuxt));
  }
  return res;
};
export const useAuth = () => {
  const localAuth = useLocalAuth();
  localAuth.signIn = signIn;
  localAuth.signOut = signOut;
  const { refreshToken, stelaceToken, stelaceRefreshToken, stelaceStatus } = useAuthState();
  return {
    ...localAuth,
    refreshToken: readonly(refreshToken),
    stelaceToken: readonly(stelaceToken),
    stelaceRefreshToken: readonly(stelaceRefreshToken),
    stelaceStatus: readonly(stelaceStatus),
    refresh
  };
};
