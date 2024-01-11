import { readonly } from "vue";
import { callWithNuxt } from "#app/nuxt";
import { _fetch } from "../../utils/fetch.mjs";
import { jsonPointerGet, useTypedBackendConfig } from "../../helpers.mjs";
import { getRequestURLWN } from "../../utils/callWithNuxt.mjs";
import { useAuthState } from "./useAuthState.mjs";
import { useNuxtApp, useRuntimeConfig, nextTick, navigateTo } from "#imports";
const signIn = async (credentials, signInOptions, signInParams) => {
  const nuxt = useNuxtApp();
  const config = useTypedBackendConfig(useRuntimeConfig(), "local");
  const { path, method } = config.endpoints.signIn;
  const response = await _fetch(nuxt, path, {
    method,
    body: {
      ...credentials,
      ...signInOptions ?? {}
    },
    params: signInParams ?? {}
  });
  const extractedToken = jsonPointerGet(response, config.token.signInResponseTokenPointer);
  if (typeof extractedToken !== "string") {
    console.error(`Auth: string token expected, received instead: ${JSON.stringify(extractedToken)}. Tried to find token at ${config.token.signInResponseTokenPointer} in ${JSON.stringify(response)}`);
    return;
  }
  const { rawToken } = useAuthState();
  rawToken.value = extractedToken;
  await nextTick(getSession);
  const { callbackUrl, redirect = true, external } = signInOptions ?? {};
  if (redirect) {
    const urlToNavigateTo = callbackUrl ?? await getRequestURLWN(nuxt);
    return navigateTo(urlToNavigateTo, { external });
  }
};
const signOut = async (signOutOptions) => {
  const nuxt = useNuxtApp();
  const runtimeConfig = await callWithNuxt(nuxt, useRuntimeConfig);
  const config = useTypedBackendConfig(runtimeConfig, "local");
  const { data, rawToken, token } = await callWithNuxt(nuxt, useAuthState);
  const headers = new Headers({ [config.token.headerName]: token.value });
  data.value = null;
  rawToken.value = null;
  const signOutConfig = config.endpoints.signOut;
  let res;
  if (signOutConfig) {
    const { path, method } = signOutConfig;
    res = await _fetch(nuxt, path, { method, headers });
  }
  const { callbackUrl, redirect = true, external } = signOutOptions ?? {};
  if (redirect) {
    await navigateTo(callbackUrl ?? await getRequestURLWN(nuxt), { external });
  }
  return res;
};
const getSession = async (getSessionOptions) => {
  const nuxt = useNuxtApp();
  const config = useTypedBackendConfig(useRuntimeConfig(), "local");
  const { path, method } = config.endpoints.getSession;
  const { data, loading, lastRefreshedAt, token, rawToken } = useAuthState();
  if (!token.value && !getSessionOptions?.force) {
    return;
  }
  const headers = new Headers(token.value ? { [config.token.headerName]: token.value } : void 0);
  loading.value = true;
  try {
    data.value = await _fetch(nuxt, path, { method, headers });
  } catch {
    data.value = null;
    rawToken.value = null;
  }
  loading.value = false;
  lastRefreshedAt.value = /* @__PURE__ */ new Date();
  const { required = false, callbackUrl, onUnauthenticated, external } = getSessionOptions ?? {};
  if (required && data.value === null) {
    if (onUnauthenticated) {
      return onUnauthenticated();
    } else {
      await navigateTo(callbackUrl ?? await getRequestURLWN(nuxt), { external });
    }
  }
  return data.value;
};
const signUp = async (credentials, signInOptions, signUpOptions) => {
  const nuxt = useNuxtApp();
  const { path, method } = useTypedBackendConfig(useRuntimeConfig(), "local").endpoints.signUp;
  await _fetch(nuxt, path, {
    method,
    body: credentials
  });
  if (signUpOptions?.preventLoginFlow) {
    return;
  }
  return signIn(credentials, signInOptions);
};
export const useAuth = () => {
  const {
    data,
    status,
    lastRefreshedAt,
    token
  } = useAuthState();
  const getters = {
    status,
    data: readonly(data),
    lastRefreshedAt: readonly(lastRefreshedAt),
    token: readonly(token)
  };
  const actions = {
    getSession,
    signIn,
    signOut,
    signUp
  };
  return {
    ...getters,
    ...actions
  };
};
