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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  loading?: boolean;
}>();

const emit = defineEmits(["submit", "toggle", "github"]);

const email = defineModel<string>("email", { default: "" });
const password = defineModel<string>("password", { default: "" });

const emailInput = ref<any>(null);

onMounted(() => {
  // Use nextTick or a small timeout to ensure the element is ready and transition hasn't blocked it
  setTimeout(() => {
    emailInput.value?.$el?.focus?.() || emailInput.value?.focus?.();
  }, 100);
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> ¡Hola de nuevo! </CardTitle>
        <CardDescription>
          Inicia sesión con tu cuenta de GitHub o correo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="emit('submit')">
          <FieldGroup>
            <Field>
              <Button
                variant="outline"
                type="button"
                class="w-full"
                @click="emit('github')"
              >
                <Icon name="simple-icons:github" class="mr-2 h-4 w-4" />
                Continuar con GitHub
              </Button>
            </Field>
            <FieldSeparator
              class="*:data-[slot=field-separator-content]:bg-card text-xs"
            >
              O continúa con
            </FieldSeparator>
            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                id="email"
                ref="emailInput"
                v-model="email"
                type="email"
                placeholder="m@ejemplo.com"
                required
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password"> Contraseña </FieldLabel>
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-4 hover:underline hidden"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
              />
            </Field>
            <Field>
              <Button type="submit" class="w-full" :disabled="props.loading">
                <Spinner v-if="props.loading" class="mr-2 text-current" />
                {{ props.loading ? "Cargando..." : "Iniciar Sesión" }}
              </Button>
              <FieldDescription class="text-center">
                ¿No tienes una cuenta?
                <a
                  href="#"
                  class="font-medium underline underline-offset-4"
                  @click.prevent="emit('toggle')"
                >
                  Regístrate
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
