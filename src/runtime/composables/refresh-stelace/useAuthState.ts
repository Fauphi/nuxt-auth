import { computed, watch, ComputedRef } from "vue";
import { CookieRef } from "#app";
import { useTypedBackendConfig } from "../../helpers";
import { useAuthState as useRefreshAuthState } from "../refresh/useAuthState";
import { useRuntimeConfig, useCookie, useState } from "#imports";
import { SessionStatus } from "../../types";

type UseAuthStateReturn = ReturnType<typeof useRefreshAuthState> & {
  rawStelaceToken: CookieRef<string | null>;
  stelaceToken: ComputedRef<string | null>;
  rawStelaceRefreshToken: CookieRef<string | null>;
  stelaceRefreshToken: ComputedRef<string | null>;
  stelaceStatus: ComputedRef<SessionStatus>;
};

export const useAuthState = (): UseAuthStateReturn => {
  const config = useTypedBackendConfig(useRuntimeConfig(), "refresh");
  const refreshAuthState = useRefreshAuthState();

  // Re-construct state from cookie, also setup a cross-component sync via a useState hack, see https://github.com/nuxt/nuxt/issues/13020#issuecomment-1397282717
  const _rawStelaceTokenCookie = useCookie<string | null>(
    "auth:stelace:token",
    {
      default: () => null,
      maxAge: config.stelaceToken.maxAgeInSeconds,
      sameSite: "lax",
    }
  );

  const rawStelaceToken = useState(
    "auth:raw-stelace-token",
    () => _rawStelaceTokenCookie.value
  );

  watch(rawStelaceToken, () => {
    console.log("watcher rawStelaceToken: ", rawStelaceToken.value);
    _rawStelaceTokenCookie.value = rawStelaceToken.value;
  });

  const stelaceToken = computed(() => {
    if (rawStelaceToken.value === null) {
      return null;
    }
    return rawStelaceToken.value;
  });

  // stelace refresh token
  const _rawStelaceRefreshTokenCookie = useCookie<string | null>(
    "auth:stelace:refresh-token",
    {
      default: () => null,
      maxAge: config.stelaceToken.maxAgeInSeconds,
      sameSite: "lax",
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
    rawStelaceRefreshToken,
  };

  // stelace status
  const stelaceStatus = computed<SessionStatus>(() => {
    if (stelaceToken.value && stelaceRefreshToken.value) {
      return "authenticated";
    } else {
      return "unauthenticated";
    }
  });

  console.log("stelaceStatus: ", stelaceStatus.value);

  return {
    ...refreshAuthState,
    ...schemeSpecificState,
    stelaceStatus,
  };
};
export default useAuthState;
