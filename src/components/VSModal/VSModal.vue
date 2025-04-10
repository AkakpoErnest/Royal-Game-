<template>
  <transition name="fade">
    <div 
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      @click.self="close"
    >
      <div class="text-center">
        <h2 class="text-4xl font-bold text-white mb-4">⚔️ Battle!</h2>
        <p class="text-2xl text-yellow-300 font-mono animate-pulse">
          {{ vsText }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const vsText = ref('')

const open = (text) => {
  vsText.value = text
  show.value = true
}

const close = () => {
  show.value = false
}

defineExpose({ open, close })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>