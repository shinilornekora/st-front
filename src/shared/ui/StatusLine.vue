<template>
  <Transition name="slide">
    <div v-if="show" :class="$style.statusLine">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  message: string;
}>();
</script>

<style module>
.statusLine {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--background-default);
  color: #306D68;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
}

.slide-enter-active {
  animation: slideUp 0.3s ease-out;
}

.slide-leave-active {
  animation: slideDown 0.3s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
