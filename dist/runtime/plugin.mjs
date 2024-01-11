import { getHeader } from "h3";
import authMiddleware from "./middleware/auth.mjs";
import { addRouteMiddleware, defineNuxtPlugin, useRuntimeConfig, useAuth, useAuthState } from "#imports";
export default defineNuxtPlugin(async (nuxtApp) => {
  const { data, lastRefreshedAt } = useAuthState();
  const { getSession } = useAuth();
  const runtimeConfig = useRuntimeConfig().public.auth;
  let nitroPrerender = false;
  if (nuxtApp.ssrContext) {
    nitroPrerender = getHeader(nuxtApp.ssrContext.event, "x-nitro-prerender") !== void 0;
  }
  if (typeof data.value === "undefined" && !nitroPrerender) {
    await getSession();
  }
  const { enableRefreshOnWindowFocus, enableRefreshPeriodically } = runtimeConfig.session;
  const visibilityHandler = () => {
    if (enableRefreshOnWindowFocus && document.visibilityState === "visible") {
      getSession();
    }
  };
  let refetchIntervalTimer;
  let refreshTokenIntervalTimer;
  nuxtApp.hook("app:mounted", () => {
    document.addEventListener("visibilitychange", visibilityHandler, false);
    if (enableRefreshPeriodically !== false) {
      const intervalTime = enableRefreshPeriodically === true ? 1e3 : enableRefreshPeriodically;
      refetchIntervalTimer = setInterval(() => {
        if (data.value) {
          getSession();
        }
      }, intervalTime);
    }
    if (runtimeConfig.provider.type === "refresh") {
      const intervalTime = runtimeConfig.provider.token.maxAgeInSeconds * 1e3;
      const { refresh, refreshToken } = useAuth();
      refreshTokenIntervalTimer = setInterval(() => {
        if (refreshToken.value) {
          refresh();
        }
      }, intervalTime);
    }
  });
  const _unmount = nuxtApp.vueApp.unmount;
  nuxtApp.vueApp.unmount = function() {
    document.removeEventListener("visibilitychange", visibilityHandler, false);
    clearInterval(refetchIntervalTimer);
    if (refreshTokenIntervalTimer) {
      clearInterval(refreshTokenIntervalTimer);
    }
    lastRefreshedAt.value = void 0;
    data.value = void 0;
    _unmount();
  };
  const { globalAppMiddleware } = useRuntimeConfig().public.auth;
  if (globalAppMiddleware === true || globalAppMiddleware.isEnabled) {
    addRouteMiddleware("auth", authMiddleware, {
      global: true
    });
  }
});
