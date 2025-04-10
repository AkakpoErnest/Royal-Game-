<script setup>
import { ref } from 'vue'
import './assets/main.css'
import VSModal from '@/components/VSModal/VSModal.vue'

const vsModal = ref(null)

const handleShowBattle = (battleText) => {
  vsModal.value.open(battleText)
}
</script>

<template>
  <div class="dark bg-gray-900 min-h-screen text-white font-sans relative">
    <router-view v-slot="{ Component }">
      <component :is="Component" @show-battle="handleShowBattle" />
    </router-view>
    <VSModal ref="vsModal" />
  </div>
</template>
