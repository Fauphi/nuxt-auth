import { computed, watch } from "vue";
import { makeCommonAuthState } from "../commonAuthState.mjs";
import { useTypedBackendConfig } from "../../helpers.mjs";
import { useRuntimeConfig, useCookie, useState } from "#imports";
export const useAuthState = () => {
  const config = useTypedBackendConfig(useRuntimeConfig(), "local");
  const commonAuthState = makeCommonAuthState();
  const _rawTokenCookie = useCookie("auth:token", { default: () => null, maxAge: config.token.maxAgeInSeconds, sameSite: config.token.sameSiteAttribute });
  const rawToken = useState("auth:raw-token", () => _rawTokenCookie.value);
  watch(rawToken, () => {
    _rawTokenCookie.value = rawToken.value;
  });
  const token = computed(() => {
    if (rawToken.value === null) {
      return null;
    }
    return config.token.type.length > 0 ? `${config.token.type} ${rawToken.value}` : rawToken.value;
  });
  const setToken = (newToken) => {
    rawToken.value = newToken;
  };
  const clearToken = () => {
    setToken(null);
  };
  const schemeSpecificState = {
    token,
    rawToken
  };
  return {
    ...commonAuthState,
    ...schemeSpecificState,
    setToken,
    clearToken
  };
};
export default useAuthState;
