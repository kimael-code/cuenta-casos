<script setup lang="ts">
import { useSession } from "@/utils/auth-client";
import type { Counter } from "@/types/counter";
import { Button } from "@/components/ui/button";
import TallyMark from "@/components/TallyMark.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const session = useSession();
const user = computed(() => session.value?.data?.user);

const isRedirecting = ref(false);

definePageMeta({
  layout: "default",
});

const counters = ref<Counter[]>([]);
const loading = ref(true);
const creating = ref(false);

// New counter form
const showCreateDialog = ref(false);
const newCounterTitle = ref("");

// Delete confirmation
const showDeleteDialog = ref(false);
const counterToDeleteId = ref<string | null>(null);

async function fetchCounters() {
  try {
    const data = await $fetch<Counter[]>("/api/counters");
    counters.value = data;
  } catch (error) {
    console.error("Failed to fetch counters", error);
  } finally {
    loading.value = false;
  }
}

async function createCounter() {
  if (!newCounterTitle.value.trim()) return;
  creating.value = true;
  try {
    const newCounter = await $fetch<Counter>("/api/counters", {
      method: "POST",
      body: { title: newCounterTitle.value },
    });
    counters.value.unshift(newCounter);
    newCounterTitle.value = "";
    showCreateDialog.value = false;
  } catch (error) {
    console.error("Failed to create counter", error);
  } finally {
    creating.value = false;
  }
}

async function updateCounter(id: string, increment: number) {
  // Optimistic update
  const counter = counters.value.find((c) => c.id === id);
  if (counter) {
    // Prevent negative counts if desired, or allow them.
    // Usually tally counters are >= 0.
    if (counter.count + increment < 0) return;
    counter.count += increment;
  }

  try {
    await $fetch(`/api/counters/${id}`, {
      method: "PATCH",
      body: { increment },
    });
  } catch (error) {
    // Revert on error
    if (counter) {
      counter.count -= increment;
    }
    console.error("Failed to update counter", error);
  }
}

async function requestDelete(id: string) {
  counterToDeleteId.value = id;
  showDeleteDialog.value = true;
}

async function confirmDelete() {
  const id = counterToDeleteId.value;
  if (!id) return;

  showDeleteDialog.value = false;

  // Optimistic remove
  const previousCounters = [...counters.value];
  counters.value = counters.value.filter((c) => c.id !== id);

  try {
    await $fetch(`/api/counters/${id}`, { method: "DELETE" });
  } catch (error) {
    // Revert
    counters.value = previousCounters;
    console.error("Failed to delete counter", error);
  } finally {
    counterToDeleteId.value = null;
  }
}

onMounted(() => {
  watchEffect(() => {
    // Access properties safely handling potentially different return types (reactive vs refs)
    const isPending = session.value?.isPending;
    const sessionUser = session.value?.data?.user;

    if (!sessionUser && !isPending && !isRedirecting.value) {
      if (import.meta.client) {
        isRedirecting.value = true;
        navigateTo("/login");
      }
    }
  });
  fetchCounters();
});
</script>

<template>
  <div>
    <ClientOnly>
      <div class="min-h-screen pb-20">
        <!-- Padding bottom for FAB space -->
        <div v-if="user" class="container max-w-2xl mx-auto py-6 px-4">
          <header class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold tracking-tight">Mis Contadores</h1>

            <!-- Desktop Add Button (visible only on md+) -->
            <Button
              class="hidden md:flex"
              size="sm"
              @click="showCreateDialog = true"
            >
              <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
              Nuevo
            </Button>
          </header>

          <!-- Content Switcher with Transition -->
          <Transition name="fade" mode="out-in">
            <div v-if="loading" key="loading" class="flex justify-center py-10">
              <div
                class="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Spinner class="size-8" />
                <span>Cargando...</span>
              </div>
            </div>

            <div
              v-else-if="counters.length === 0"
              key="empty"
              class="text-center py-20 text-muted-foreground flex flex-col items-center gap-4"
            >
              <div class="bg-muted p-4 rounded-full">
                <Icon name="lucide:tally-5" class="h-8 w-8 opacity-50" />
              </div>
              <p>No tienes contadores activos.</p>
              <Button variant="outline" @click="showCreateDialog = true"
                >Crear el primero</Button
              >
            </div>

            <!-- Mobile-First Grid List -->
            <div v-else key="list">
              <TransitionGroup
                name="list"
                tag="div"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div
                  v-for="counter in counters"
                  :key="counter.id"
                  class="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <!-- Main "Tap Area" for incrementing -->
                  <button
                    class="absolute inset-0 w-full h-full z-0 cursor-pointer active:bg-accent/50 transition-colors"
                    aria-label="Incrementar contador"
                    @click="updateCounter(counter.id, 1)"
                  />

                  <div class="relative z-10 p-5 pointer-events-none">
                    <!-- Content on top -->
                    <div class="flex justify-between items-start mb-2">
                      <h3
                        class="font-medium text-lg leading-tight truncate pr-8"
                      >
                        {{ counter.name }}
                      </h3>
                      <!-- Delete (Needs pointer-events-auto) -->
                      <button
                        class="pointer-events-auto text-muted-foreground hover:text-destructive p-1 -mr-2 -mt-2 rounded-full hover:bg-destructive/10 transition-colors"
                        @click.stop="requestDelete(counter.id)"
                      >
                        <Icon name="lucide:trash-2" class="h-4 w-4" />
                      </button>
                    </div>

                    <div class="flex items-end justify-between mt-4">
                      <div class="flex flex-col">
                        <!-- Digital Number -->
                        <span
                          class="text-5xl font-extrabold tracking-tighter tabular-nums leading-none"
                        >
                          {{ counter.count }}
                        </span>
                      </div>

                      <!-- Decrement Button (Pointer events auto) -->
                      <button
                        class="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full border bg-background hover:bg-muted text-muted-foreground active:scale-95 transition-all"
                        :disabled="counter.count <= 0"
                        @click.stop="updateCounter(counter.id, -1)"
                      >
                        <Icon name="lucide:minus" class="h-5 w-5" />
                      </button>
                    </div>

                    <!-- Tally Marks Visualization -->
                    <div class="mt-4 pt-3 border-t border-border/50 min-h-8">
                      <TallyMark :count="counter.count" class="opacity-70" />
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </Transition>
        </div>

        <!-- Fallback Loading (Full page) -->
        <div v-else class="flex h-[50vh] items-center justify-center">
          <Spinner class="size-8" />
        </div>

        <!-- Floating Action Button (Mobile) -->
        <div class="fixed bottom-6 right-6 z-50 md:hidden">
          <Button
            size="icon"
            class="h-14 w-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all"
            @click="showCreateDialog = true"
          >
            <Icon name="lucide:plus" class="h-6 w-6" />
          </Button>
        </div>

        <!-- Create Dialog -->
        <Dialog v-model:open="showCreateDialog">
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Contador</DialogTitle>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <input
                v-model="newCounterTitle"
                class="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nombre del contador..."
                autofocus
                @keydown.enter="createCounter"
              >
            </div>
            <DialogFooter class="sm:justify-between flex-row gap-2">
              <Button
                type="button"
                variant="ghost"
                @click="showCreateDialog = false"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                :disabled="creating || !newCounterTitle.trim()"
                @click="createCounter"
              >
                {{ creating ? "Creando..." : "Crear" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Delete Alert Dialog -->
        <AlertDialog
          :open="showDeleteDialog"
          @update:open="showDeleteDialog = $event"
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente
                este contador y todos sus datos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel @click="showDeleteDialog = false"
                >Cancelar</AlertDialogCancel
              >
              <AlertDialogAction
                class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                @click="confirmDelete"
                >Eliminar</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Content Switch Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* List Transitions */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* ensure leaving items are taken out of layout flow so others can move smoothly */
/* Position absolute removed to prevent grid layout glitches (width explosion and height collapse) */
</style>
