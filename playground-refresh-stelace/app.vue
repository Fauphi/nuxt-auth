<script lang="ts" setup>
import { ref } from "vue";
import { useAuth } from "#imports";
const {
  signIn,
  token,
  refreshToken,
  stelaceToken,
  stelaceRefreshToken,
  refresh,
  data,
  status,
  stelaceStatus,
  lastRefreshedAt,
  signOut,
  getSession,
} = useAuth();
const username = ref("hunter");
const password = ref("hunter2");
</script>

<template>
  <div>
    <pre>Status: {{ status }}</pre>
    <pre>Stelace-Status: {{ stelaceStatus }}</pre>
    <pre>Data: {{ data || "no session data present, are you logged in?" }}</pre>
    <pre>Last refreshed at: {{ lastRefreshedAt || "no refresh happened" }}</pre>
    <pre>JWT token: {{ token || "no token present, are you logged in?" }}</pre>
    <pre>
JWT refreshToken: {{
        refreshToken || "no refreshToken present, are you logged in?"
      }}</pre
    >
    <pre>
JWT stelace token: {{
        stelaceToken || "no stelace token present, are you logged in?"
      }}</pre
    >
    <pre>
JWT stelace refresh token: {{
        stelaceRefreshToken ||
        "no stelace refresh token present, are you logged in?"
      }}</pre
    >
    <form @submit.prevent="signIn({ username, password })">
      <input v-model="username" type="text" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">sign in</button>
    </form>
    <br />
    <button
      @click="
        signIn({ username, password }, { callbackUrl: '/protected/globally' })
      "
    >
      sign in (with redirect to protected page)
    </button>
    <br />
    <button @click="signOut({ callbackUrl: '/signout' })">sign out</button>
    <br />
    <button @click="getSession({ required: false })">
      refresh session (required: false)
    </button>
    <br />
    <button @click="getSession({ required: true, callbackUrl: '/' })">
      refresh session (required: true)
    </button>
    <br />
    <button @click="refresh()">refresh tokens</button>
    <NuxtPage />
  </div>
</template>
