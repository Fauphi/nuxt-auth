export default defineNuxtConfig({
  modules: ["../src/module.ts"],
  build: {
    transpile: ["jsonwebtoken"],
  },
  auth: {
    provider: {
      type: "refresh-stelace",
      // refreshOnlyToken: true,
      endpoints: {
        getSession: { path: "/user" },
        refresh: { path: "/refresh", method: "post" },
      },
      pages: {
        login: "/",
      },
      token: {
        signInResponseTokenPointer: "/token/accessToken",
        maxAgeInSeconds: 60, // 5 min
        sameSiteAttribute: "lax",
      },
      refreshOnlyToken: false,
      refreshToken: {
        signInResponseRefreshTokenPointer: "/token/refreshToken",
      },
      stelaceToken: {
        signInResponseStelaceTokenPointer: "/token/stelaceToken",
        signInResponseStelaceRefreshTokenPointer: "/token/stelaceRefreshToken",
      },
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
});
