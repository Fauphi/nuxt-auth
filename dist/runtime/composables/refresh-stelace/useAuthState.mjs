import { computed, watch } from "vue";
import { useTypedBackendConfig } from "../../helpers.mjs";
import { useAuthState as useRefreshAuthState } from "../refresh/useAuthState.mjs";
import { useRuntimeConfig, useCookie, useState } from "#imports";
export const useAuthState = () => {
  const config = useTypedBackendConfig(useRuntimeConfig(), "refresh");
  const refreshAuthState = useRefreshAuthState();
  const _rawStelaceTokenCookie = useCookie(
    "auth:stelace:token",
    {
      default: () => null,
      maxAge: config.stelaceToken.maxAgeInSeconds,
      sameSite: "lax"
    }
  );
  const rawStelaceToken = useState(
    "auth:raw-stelace-token",
    () => _rawStelaceTokenCookie.value
  );
  watch(rawStelaceToken, () => {
    _rawStelaceTokenCookie.value = rawStelaceToken.value;
  });
  const stelaceToken = computed(() => {
    if (rawStelaceToken.value === null) {
      return null;
    }
    return rawStelaceToken.value;
  });
  const _rawStelaceRefreshTokenCookie = useCookie(
    "auth:stelace:refresh-token",
    {
      default: () => null,
      maxAge: config.stelaceToken.maxAgeInSeconds,
      sameSite: "lax"
    }
  );
  const rawStelaceRefreshToken = useState(
    "auth:raw-stelace-refresh-token",
    () => _rawStelaceRefreshTokenCookie.value
  );
  watch(rawStelaceRefreshToken, () => {
    _rawStelaceRefreshTokenCookie.value = rawStelaceRefreshToken.value;
  });
  const stelaceRefreshToken = computed(() => {
    if (rawStelaceRefreshToken.value === null) {
      return null;
    }
    return rawStelaceRefreshToken.value;
  });
  const schemeSpecificState = {
    stelaceToken,
    rawStelaceToken,
    stelaceRefreshToken,
    rawStelaceRefreshToken
  };
  const stelaceStatus = computed(() => {
    if (stelaceToken.value && stelaceRefreshToken.value) {
      return "authenticated";
    } else {
      return "unauthenticated";
    }
  });
  return {
    ...refreshAuthState,
    ...schemeSpecificState,
    stelaceStatus
  };
};
export default useAuthState;
