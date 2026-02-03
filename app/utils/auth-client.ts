import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  // baseURL inferred from runtimeConfig or default
});

export const { signIn, signOut, useSession, signUp } = authClient;
