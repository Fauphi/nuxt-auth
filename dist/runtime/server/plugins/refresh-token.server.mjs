import { _fetch } from "../../utils/fetch.mjs";
import { jsonPointerGet, useTypedBackendConfig } from "../../helpers.mjs";
import { defineNuxtPlugin, useAuthState, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin({
  name: "refresh-token-plugin",
  enforce: "pre",
  async setup(nuxtApp) {
    const { rawToken, rawRefreshToken, refreshToken, token, lastRefreshedAt } = useAuthState();
    if (refreshToken.value && token.value) {
      const config = nuxtApp.$config.public.auth;
      const configToken = useTypedBackendConfig(useRuntimeConfig(), "refresh");
      const { path, method } = config.provider.endpoints.refresh;
      const headers = new Headers({
        [configToken.token.headerName]: token.value
      });
      const response = await _fetch(nuxtApp, path, {
        method,
        body: {
          refreshToken: refreshToken.value
        },
        headers
      });
      const extractedToken = jsonPointerGet(
        response,
        config.provider.token.signInResponseTokenPointer
      );
      if (typeof extractedToken !== "string") {
        console.error(
          `Auth: string token expected, received instead: ${JSON.stringify(
            extractedToken
          )}. Tried to find token at ${config.token.signInResponseTokenPointer} in ${JSON.stringify(response)}`
        );
        return;
      }
      if (!configToken.refreshOnlyToken) {
        const extractedRefreshToken = jsonPointerGet(
          response,
          config.provider.refreshToken.signInResponseRefreshTokenPointer
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
      rawToken.value = extractedToken;
      lastRefreshedAt.value = /* @__PURE__ */ new Date();
    }
  }
});
