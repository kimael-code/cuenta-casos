<script setup lang="ts">
defineProps<{
  count: number;
}>();
</script>

<template>
  <div
    class="flex flex-wrap gap-1 select-none pointer-events-none"
    aria-hidden="true"
  >
    <div
      v-for="i in Math.floor(Math.max(0, count) / 5)"
      :key="`group-${i}`"
      class="relative w-8 h-6 flex justify-between px-0.5"
    >
      <!-- The 4 vertical lines -->
      <div class="w-1 h-full bg-foreground/80 rounded-full" />
      <div class="w-1 h-full bg-foreground/80 rounded-full" />
      <div class="w-1 h-full bg-foreground/80 rounded-full" />
      <div class="w-1 h-full bg-foreground/80 rounded-full" />

      <!-- The diagonal line (5th) -->
      <div
        class="absolute top-1/2 left-1/2 w-full h-1 bg-foreground transform -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full shadow-sm"
      />
    </div>

    <!-- Remaining lines -->
    <div v-if="count % 5 > 0" class="relative h-6 flex gap-1 px-1">
      <div
        v-for="j in count % 5"
        :key="`rem-${j}`"
        class="w-1 h-full bg-foreground/80 rounded-full"
      />
    </div>
  </div>
</template>
