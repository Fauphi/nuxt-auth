import { defineNuxtModule, useLogger, createResolver, addImports, addTemplate, addRouteMiddleware, addPlugin, addServerPlugin } from '@nuxt/kit';
import { defu } from 'defu';
import { parseURL, joinURL } from 'ufo';
import { genInterface } from 'knitwork';

const isProduction = process.env.NODE_ENV === "production";
const getOriginAndPathnameFromURL = (url) => {
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

const topLevelDefaults = {
  isEnabled: true,
  session: {
    enableRefreshPeriodically: false,
    enableRefreshOnWindowFocus: true
  },
  globalAppMiddleware: {
    isEnabled: false,
    allow404WithoutAuth: true,
    addDefaultCallbackUrl: true
  }
};
const defaultsByBackend = {
  local: {
    type: "local",
    pages: {
      login: "/login"
    },
    endpoints: {
      signIn: { path: "/login", method: "post" },
      signOut: { path: "/logout", method: "post" },
      signUp: { path: "/register", method: "post" },
      getSession: { path: "/session", method: "get" }
    },
    token: {
      signInResponseTokenPointer: "/token",
      type: "Bearer",
      headerName: "Authorization",
      maxAgeInSeconds: 30 * 60,
      sameSiteAttribute: "lax"
    },
    sessionDataType: { id: "string | number" }
  },
  refresh: {
    type: "refresh",
    pages: {
      login: "/login"
    },
    refreshOnlyToken: true,
    endpoints: {
      signIn: { path: "/login", method: "post" },
      signOut: { path: "/logout", method: "post" },
      signUp: { path: "/register", method: "post" },
      getSession: { path: "/session", method: "get" },
      refresh: { path: "/refresh", method: "post" }
    },
    token: {
      signInResponseTokenPointer: "/token",
      type: "Bearer",
      headerName: "Authorization",
      maxAgeInSeconds: 5 * 60,
      sameSiteAttribute: "none"
      // 5 minutes
    },
    refreshToken: {
      signInResponseRefreshTokenPointer: "/refreshToken",
      maxAgeInSeconds: 60 * 60 * 24 * 7
      // 7 days
    },
    sessionDataType: { id: "string | number" }
  },
  "refresh-stelace": {
    type: "refresh-stelace",
    pages: {
      login: "/login"
    },
    refreshOnlyToken: true,
    endpoints: {
      signIn: { path: "/login", method: "post" },
      signOut: { path: "/logout", method: "post" },
      signUp: { path: "/register", method: "post" },
      getSession: { path: "/session", method: "get" },
      refresh: { path: "/refresh", method: "post" }
    },
    token: {
      signInResponseTokenPointer: "/token",
      type: "Bearer",
      headerName: "Authorization",
      maxAgeInSeconds: 5 * 60,
      sameSiteAttribute: "none"
      // 5 minutes
    },
    refreshToken: {
      signInResponseRefreshTokenPointer: "/refreshToken",
      maxAgeInSeconds: 60 * 60 * 24 * 7
      // 7 days
    },
    stelaceToken: {
      signInResponseStelaceTokenPointer: "/stelaceToken",
      signInResponseStelaceRefreshTokenPointer: "/stelaceRefreshToken",
      maxAgeInSeconds: 60 * 60 * 24 * 7
      // 7 days
    },
    sessionDataType: { id: "string | number" }
  },
  authjs: {
    type: "authjs",
    trustHost: false,
    // @ts-expect-error
    defaultProvider: void 0,
    addDefaultCallbackUrl: true
  }
};
const PACKAGE_NAME = "fauphi-auth";
const module = defineNuxtModule({
  meta: {
    name: PACKAGE_NAME,
    configKey: "auth"
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(PACKAGE_NAME);
    const { origin, pathname = "/api/auth" } = getOriginAndPathnameFromURL(
      userOptions.baseURL ?? ""
    );
    const selectedProvider = userOptions.provider?.type ?? "authjs";
    const options = {
      ...defu(userOptions, topLevelDefaults, {
        computed: {
          origin,
          pathname,
          fullBaseUrl: joinURL(origin ?? "", pathname)
        }
      }),
      // We use `as` to infer backend types correctly for runtime-usage (everything is set, although for user everything was optional)
      provider: defu(
        userOptions.provider,
        defaultsByBackend[selectedProvider]
      )
    };
    if (!options.isEnabled) {
      logger.info(`Skipping ${PACKAGE_NAME} setup, as module is disabled`);
      return;
    }
    logger.info("`nuxt-auth` setup starting");
    if (!isProduction) {
      const authjsAddition = selectedProvider === "authjs" ? ", ensure that `NuxtAuthHandler({ ... })` is there, see https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler" : "";
      logger.info(
        `Selected provider: ${selectedProvider}. Auth API location is \`${options.computed.fullBaseUrl}\`${authjsAddition}`
      );
    }
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || { public: {} };
    nuxt.options.runtimeConfig.public.auth = options;
    const { resolve } = createResolver(import.meta.url);
    addImports([
      {
        name: "useAuth",
        from: resolve(`./runtime/composables/${options.provider.type}/useAuth`)
      },
      {
        name: "useAuthState",
        from: resolve(
          `./runtime/composables/${options.provider.type}/useAuthState`
        )
      }
    ]);
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === "object" ? nitroConfig.externals : {},
        {
          inline: [resolve("./runtime")]
        }
      );
      nitroConfig.alias["#auth"] = resolve("./runtime/server/services");
    });
    addTemplate({
      filename: "types/auth.d.ts",
      getContents: () => [
        "declare module '#auth' {",
        `  const getServerSession: typeof import('${resolve(
          "./runtime/server/services"
        )}').getServerSession`,
        `  const getToken: typeof import('${resolve(
          "./runtime/server/services"
        )}').getToken`,
        `  const NuxtAuthHandler: typeof import('${resolve(
          "./runtime/server/services"
        )}').NuxtAuthHandler`,
        options.provider.type === "local" ? genInterface(
          "SessionData",
          options.provider.sessionDataType
        ) : "",
        "}"
      ].join("\n")
    });
    nuxt.hook("prepare:types", (options2) => {
      options2.references.push({
        path: resolve(nuxt.options.buildDir, "types/auth.d.ts")
      });
    });
    addRouteMiddleware({
      name: "auth",
      path: resolve("./runtime/middleware/auth")
    });
    addPlugin(resolve("./runtime/plugin"));
    if (selectedProvider === "authjs") {
      addServerPlugin(resolve("./runtime/server/plugins/assertOrigin"));
    }
    if (selectedProvider === "refresh") {
      addPlugin(resolve("./runtime/server/plugins/refresh-token.server"));
    }
    logger.success("`nuxt-auth` setup done");
  }
});

export { module as default };
