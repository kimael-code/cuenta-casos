<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn, signUp, useSession } from "@/utils/auth-client";

definePageMeta({
  layout: "default",
});

const email = ref("");
const password = ref("");
const name = ref("");
const loading = ref(false);
const isSignUp = ref(false);

const session = useSession(); // Access session
const user = computed(() => {
  const sessionValue = isRef(session) ? session.value : session;
  return (
    sessionValue?.data?.user ||
    sessionValue?.user ||
    sessionValue?.data?.value?.user
  );
});

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
  loading.value = true;
  try {
    if (isSignUp.value) {
      await signUp.email({
        email: email.value,
        password: password.value,
        name: name.value,
        callbackURL: "/dashboard",
      });
    } else {
      await signIn.email({
        email: email.value,
        password: password.value,
        callbackURL: "/dashboard",
      });
    }
  } catch (error) {
    console.error(error);
    alert(isSignUp.value ? "Error al registrarse" : "Error al iniciar sesión");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">
          {{ isSignUp ? "Crear Cuenta" : "Iniciar Sesión" }}
        </CardTitle>
        <CardDescription class="text-center">
          {{
            isSignUp
              ? "Ingresa tus datos para registrarte"
              : "Ingresa a tu cuenta para gestionar tus casos"
          }}
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <Button variant="outline" class="w-full" @click="handleGithubLogin">
          <Icon name="simple-icons:github" class="mr-2 h-4 w-4" />
          Github
        </Button>
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <div v-if="isSignUp" class="grid gap-2">
          <Label for="name">Nombre</Label>
          <Input id="name" v-model="name" type="text" placeholder="Tu Nombre" />
        </div>

        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="email"
          />
        </div>
        <div class="grid gap-2">
          <Label for="password">Contraseña</Label>
          <Input id="password" type="password" v-model="password" />
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full" @click="handleEmailAuth" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>{{ isSignUp ? "Registrarse" : "Ingresar" }}</span>
        </Button>
        <Button
          variant="ghost"
          class="w-full text-sm"
          @click="isSignUp = !isSignUp"
        >
          {{
            isSignUp
              ? "¿Ya tienes cuenta? Inicia Sesión"
              : "¿No tienes cuenta? Regístrate"
          }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
