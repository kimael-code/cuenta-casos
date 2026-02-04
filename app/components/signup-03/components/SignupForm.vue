<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  loading?: boolean;
}>();

const emit = defineEmits(["submit", "toggle"]);

const name = defineModel<string>("name", { default: "" });
const email = defineModel<string>("email", { default: "" });
const password = defineModel<string>("password", { default: "" });
const confirmPassword = defineModel<string>("confirmPassword", { default: "" });

const nameInput = ref<any>(null);

onMounted(() => {
  setTimeout(() => {
    nameInput.value?.$el?.focus?.() || nameInput.value?.focus?.();
  }, 100);
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> Crea tu cuenta </CardTitle>
        <CardDescription>
          Ingresa tus datos a continuación para registrarte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="emit('submit')">
          <FieldGroup>
            <Field>
              <FieldLabel for="name"> Nombre Completo </FieldLabel>
              <Input
                id="name"
                ref="nameInput"
                v-model="name"
                type="text"
                placeholder="Tu Nombre"
                required
              />
            </Field>
            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
              />
            </Field>
            <Field>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel for="password"> Contraseña </FieldLabel>
                  <Input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel for="confirm-password"> Confirmar </FieldLabel>
                  <Input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    required
                  />
                </Field>
              </div>
              <FieldDescription class="text-xs">
                La contraseña debe tener al menos 8 caracteres.
              </FieldDescription>
            </Field>
            <Field>
              <Button type="submit" class="w-full" :disabled="props.loading">
                <Spinner v-if="props.loading" class="mr-2 text-current" />
                {{ props.loading ? "Creando cuenta..." : "Registrarse" }}
              </Button>
              <FieldDescription class="text-center">
                ¿Ya tienes una cuenta?
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  @click.prevent="emit('toggle')"
                >
                  Inicia sesión
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
