<script setup lang="ts">
import { signIn, signUp, useSession } from "@/utils/auth-client";
import LoginForm from "@/components/login-03/components/LoginForm.vue";
import SignupForm from "@/components/signup-03/components/SignupForm.vue";

definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const loading = ref(false);
const isSignUp = ref(false);

const session = useSession();
const user = computed(() => session.value?.data?.user);

onMounted(() => {
  watchEffect(() => {
    if (user.value) {
      navigateTo("/dashboard");
    }
  });
});

const handleGithubLogin = async () => {
  await signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });
};

const handleEmailAuth = async () => {
  // HTML5 Validation is handled by the browser in the child components before emitting submit.

  if (isSignUp.value && password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  loading.value = true;

  try {
    const { error } = isSignUp.value
      ? await signUp.email({
          email: email.value,
          password: password.value,
          name: name.value,
        })
      : await signIn.email({
          email: email.value,
          password: password.value,
        });

    if (error) throw error;

    navigateTo("/dashboard");
  } catch (error: any) {
    console.error(error);
    alert(
      error.message ||
        (isSignUp.value ? "Error al registrarse" : "Error al iniciar sesión"),
    );
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <Transition name="fade" mode="out-in">
      <SignupForm
        v-if="isSignUp"
        v-model:name="name"
        v-model:email="email"
        v-model:password="password"
        v-model:confirm-password="confirmPassword"
        :loading="loading"
        @submit="handleEmailAuth"
        @toggle="isSignUp = false"
      />
      <LoginForm
        v-else
        v-model:email="email"
        v-model:password="password"
        :loading="loading"
        @submit="handleEmailAuth"
        @toggle="isSignUp = true"
        @github="handleGithubLogin"
      />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
