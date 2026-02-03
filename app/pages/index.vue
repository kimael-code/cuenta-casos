<script setup lang="ts">
import { Button } from "@/components/ui/button";

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] py-12 md:py-24 lg:py-32"
  >
    <div class="container px-4 md:px-6">
      <div class="flex flex-col items-center space-y-4 text-center">
        <div class="space-y-2">
          <h1
            class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
          >
            Cuenta lo que importa.
            <span class="text-primary block mt-2"
              >Toma mejores decisiones.</span
            >
          </h1>
          <p
            class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
          >
            CuentaCasos te permite registrar y analizar los motivos de visita de
            tus clientes en tiempo real. Simple, rápido y efecivo.
          </p>
        </div>
        <div class="space-x-4">
          <Button size="lg" as-child>
            <NuxtLink to="/login">Comenzar Ahora</NuxtLink>
          </Button>
          <Button variant="outline" size="lg" as-child>
            <a
              href="https://github.com/antigravity/cuentacasos"
              target="_blank"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
