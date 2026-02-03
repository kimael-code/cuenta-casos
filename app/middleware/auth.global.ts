import { authClient } from "@/utils/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  // 1. Protected Routes (e.g., Dashboard)
  if (to.path.startsWith("/dashboard") && !session.value) {
    return navigateTo("/login");
  }

  // 2. Guest Routes (Login, Register) - Redirect to dashboard if logged in
  const guestRoutes = ["/login"];
  if (guestRoutes.includes(to.path) && session.value) {
    return navigateTo("/dashboard");
  }
});
