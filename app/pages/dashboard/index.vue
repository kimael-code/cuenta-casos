<script setup lang="ts">
import { useSession } from "@/utils/auth-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const session = useSession();
const user = computed(() => {
  const sessionValue = isRef(session) ? session.value : session;
  return (
    sessionValue?.data?.user ||
    sessionValue?.user ||
    sessionValue?.data?.value?.user
  );
});

const isRedirecting = ref(false);

definePageMeta({
  layout: "default",
});

onMounted(() => {
  watchEffect(() => {
    const sessionValue = isRef(session) ? session.value : session;
    const isPending = sessionValue?.isPending?.value || sessionValue?.isPending;

    if (!user.value && !isPending && !isRedirecting.value) {
      if (import.meta.client) {
        isRedirecting.value = true;
        navigateTo("/login");
      }
    }
  });
});
</script>

<template>
  <ClientOnly>
    <div>
      <div v-if="user" class="container mx-auto py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold">Mis Contadores</h1>
          <Button>
            <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
            Nuevo Contador
          </Button>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo de prueba</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="text-4xl font-bold text-center py-4">0</div>
              <div class="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="icon">
                  <Icon name="lucide:minus" class="h-4 w-4" />
                </Button>
                <Button size="icon">
                  <Icon name="lucide:plus" class="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div v-else class="flex h-[50vh] items-center justify-center">
        <p class="text-muted-foreground animate-pulse">Cargando...</p>
        <div class="hidden">
          {{ navigateTo("/login") }}
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="flex h-[50vh] items-center justify-center">
        <p class="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    </template>
  </ClientOnly>
</template>
