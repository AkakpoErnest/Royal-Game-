<template>
  <section class="px-6 py-12 bg-gray-800">
    <h2 class="text-3xl font-bold mb-8 text-center">⚔️ Choose Your Champion</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div 
        v-for="character in characters" 
        :key="character.name"
        :class="['bg-gray-700 rounded-2xl p-6 shadow-xl cursor-pointer character-card', 
                { 'opacity-50': !walletConnected },
                { 'ring-4 ring-indigo-500': selectedCharacter === character.name }]"
        @click="selectCharacter(character)"
      >
        <h3 class="text-xl font-semibold mb-2">{{ character.emoji }} {{ character.name }}</h3>
        <p>{{ walletConnected ? character.description : 'Locked until wallet connected.' }}</p>
      </div>
    </div>
    <p class="text-center mt-6 text-xl text-indigo-400" v-if="selectedCharacter">
      🧙 You chose: {{ selectedCharacter }}
    </p>
  </section>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  walletConnected: Boolean
})

const characters = ref([
  { name: 'Knight of Ether', emoji: '🛡️', description: 'High defense, low speed' },
  { name: 'Flame Caster', emoji: '🔥', description: 'Powerful attacks, fragile' },
  { name: 'Shadow Hacker', emoji: '🌀', description: 'Stealthy with critical hits' }
])

const selectedCharacter = ref(null)

const selectCharacter = (character) => {
  if (!props.walletConnected) return
  selectedCharacter.value = character.name
  localStorage.setItem('selectedCharacter', character.name)
}
</script>