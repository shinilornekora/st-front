<template>
  <div :class="$style.page">
    <Header />
    <main :class="$style.main">
      <h1>Партнерам (B2B)</h1>
      <p>Информация для партнеров и B2B-клиентов будет размещена здесь.</p>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer } from '@widgets';
</script>

<style module>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background-default);
}

@media (max-width: 480px) {
  .page {
    padding-bottom: 46px; /* Space for mobile footer */
  }
}

.main {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 24px;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: var(--color-secondary);
}
</style>
