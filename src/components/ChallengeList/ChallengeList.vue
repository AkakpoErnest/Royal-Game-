<template>
  <section class="px-6 py-12 bg-gray-900 border-t border-gray-800">
    <h2 class="text-3xl font-bold mb-8 text-center">🎯 Challenge a Player</h2>
    <div class="max-w-xl mx-auto space-y-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2">Loading fixtures...</p>
      </div>
      
      <div v-if="error" class="bg-red-900/50 text-red-300 p-4 rounded-lg">
        {{ error }}
      </div>
      
      <template v-if="!isLoading">
        <div 
          v-for="fixture in fixtures" 
          :key="fixture.id"
          class="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow hover:bg-gray-700 transition-colors"
        >
          <div>
            <span class="text-lg font-medium">{{ fixture.teams.home.name }}</span>
            <span class="mx-2 text-gray-400">vs</span>
            <span class="text-lg font-medium">{{ fixture.teams.away.name }}</span>
          </div>
          <button 
            @click="handleChallenge(fixture)"
            class="challenge-btn bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition-colors"
            :disabled="isLoading"
          >
            Challenge
          </button>
        </div>
      </template>
    </div>

    <section class="px-6 py-12 bg-gray-800 text-center">
      <h2 class="text-2xl font-bold mb-4">🥊 Battle Result</h2>
      <div 
        :class="[
          'text-xl font-mono',
          battleResult ? 'text-yellow-400 animate-pulse' : 'text-gray-400'
        ]"
      >
        {{ battleResult || 'No battle yet.' }}
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const fixtures = ref([])
const battleResult = ref('')

const isLoading = ref(false)
const error = ref(null)

const fetchFixtures = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
        league: '39',
        season: '2023',
        last: '10'
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_API_FOOTBALL_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_API_FOOTBALL_HOST
      }
    })
    
    fixtures.value = response.data.response.slice(0, 10)
  } catch (err) {
    error.value = 'Failed to load fixtures. Using mock data instead.'
    console.error(err)
    // Fallback to mock data
    fixtures.value = [
      {
        id: 1,
        teams: { home: { name: 'Team A' }, away: { name: 'Team B' } }
      },
      {
        id: 2, 
        teams: { home: { name: 'Team C' }, away: { name: 'Team D' } }
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Fetch fixtures on component mount
fetchFixtures()

const emit = defineEmits(['show-battle'])

const handleChallenge = async (fixture) => {
  const character = localStorage.getItem('selectedCharacter') || 'Your Champion'
  const opponent = `${fixture.teams.home.name} vs ${fixture.teams.away.name}`
  
  // Show battle modal
  emit('show-battle', `${character} vs ${opponent}`)
  
  // Simulate battle outcome after delay
  setTimeout(() => {
    const outcomes = ['🏆 You Win!', '💀 You Lose!', '🤝 Draw!']
    battleResult.value = `You challenged ${opponent}... ${outcomes[Math.floor(Math.random() * outcomes.length)]}`
    
    // Clear result after 5 seconds
    setTimeout(() => {
      battleResult.value = ''
    }, 5000)
  }, 3000)
}
</script>