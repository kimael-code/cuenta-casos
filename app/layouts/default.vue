<template>
  <div class="min-h-screen bg-background font-sans antialiased flex flex-col">
    <!-- Navbar -->
    <header
      class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div
        class="container mx-auto px-4 h-14 flex items-center justify-between"
      >
        <div class="mr-4 flex">
          <a
            class="mr-6 flex items-center space-x-2 font-bold text-lg"
            href="/"
          >
            <span>CuentaCasos</span>
          </a>
        </div>
        <div class="flex items-center space-x-4">
          <nav class="flex items-center space-x-2">
            <NuxtLink
              to="/login"
              class="text-sm font-medium transition-colors hover:text-primary"
              >Iniciar Sesión</NuxtLink
            >
            <!-- Button component will go here later -->
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="py-6 md:px-8 md:py-0 border-t">
      <div
        class="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
      >
        <p
          class="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left"
        >
          Built with <span class="text-red-500">❤️</span> by
          <a
            href="https://maikel-dev.vercel.app"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4"
            >Maikel Carballo</a
          >. The source code is available on
          <a
            href="https://github.com/kimael-code/cuentacasos"
            target="_blank"
            rel="noreferrer"
            class="font-medium underline underline-offset-4 inline-flex items-center gap-1"
          >
            <Icon name="simple-icons:github" class="w-4 h-4" />
            GitHub </a
          >.
        </p>
      </div>
    </footer>
  </div>
</template>
