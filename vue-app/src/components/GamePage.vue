<template>
  <div class="bg-gray-900 text-white font-sans min-h-screen">
    <!-- HERO SECTION -->
    <section class="text-center py-20">
      <h1 class="text-5xl font-bold mb-4 animate-pulse">👑 Royal Rumble</h1>
      <p class="text-lg mb-6">Enter the blockchain arena. Choose your champion. Battle your friends.</p>
      <button 
        @click="connectWallet"
        id="connectBtn" 
        class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md"
      >
        {{ walletConnected ? 'Wallet Connected' : 'Connect Wallet' }}
      </button>
      <p v-if="walletAddress" class="mt-4 text-green-400 text-sm">Connected: {{ walletAddress }}</p>
      <p class="mt-4 text-yellow-300 text-lg font-mono">🏅 Win Streak XP: {{ xp }}</p>
    </section>

    <!-- TEAM SECTION -->
    <section class="px-6 py-12 bg-gray-800">
      <h2 class="text-3xl font-bold mb-8 text-center">⚔️ Choose Your Champion</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div 
          v-for="character in characters"
          :key="character.name"
          @click="selectCharacter(character)"
          :class="[
            'bg-gray-700 rounded-2xl p-6 shadow-xl cursor-pointer character-card',
            walletConnected ? '' : 'opacity-50',
            selectedCharacter?.name === character.name ? 'ring-4 ring-indigo-500' : ''
          ]"
        >
          <h3 class="text-xl font-semibold mb-2">{{ character.emoji }} {{ character.name }}</h3>
          <p>{{ walletConnected ? 'Available' : 'Locked until wallet connected' }}</p>
        </div>
      </div>
      <p v-if="selectedCharacter" class="text-center mt-6 text-xl text-indigo-400">
        🧙 You chose: {{ selectedCharacter.name }}
      </p>
    </section>

    <!-- CHALLENGE SECTION -->
    <section class="px-6 py-12 bg-gray-900 border-t border-gray-800">
      <h2 class="text-3xl font-bold mb-8 text-center">⚽ Live Fixtures</h2>
      
      <div v-if="fixturesLoading" class="text-center py-8">
        <p class="text-xl animate-pulse">Loading fixtures...</p>
      </div>
      
      <div v-else-if="fixturesError" class="text-center py-8 text-red-500">
        <p>Error loading fixtures: {{ fixturesError.message }}</p>
      </div>
      
      <div v-else class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="fixture in fixtures"
          :key="fixture.fixture.id"
          class="bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <div class="text-center flex-1">
              <h3 class="text-xl font-bold">{{ fixture.teams.home.name }}</h3>
              <p class="text-sm text-gray-400">Home</p>
            </div>
            <div class="text-center mx-4">
              <p class="text-2xl font-bold">vs</p>
              <p class="text-sm">{{ new Date(fixture.fixture.date).toLocaleTimeString() }}</p>
            </div>
            <div class="text-center flex-1">
              <h3 class="text-xl font-bold">{{ fixture.teams.away.name }}</h3>
              <p class="text-sm text-gray-400">Away</p>
            </div>
          </div>
          
          <button 
            @click="handleChallenge(fixture)"
            class="w-full challenge-btn bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-bold"
            :disabled="!walletConnected || !selectedCharacter"
          >
            Challenge This Match
          </button>
        </div>

        <section v-if="battleResult" class="px-6 py-8 bg-gray-800 rounded-xl text-center mt-8">
          <h2 class="text-2xl font-bold mb-4">🥊 Battle Result</h2>
          <div class="text-xl text-yellow-400 font-mono animate-pulse">
            {{ battleResult }}
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ethers } from 'ethers';
import axios from 'axios';

export default {
  setup() {
    const walletConnected = ref(false);
    const walletAddress = ref('');
    const xp = ref(0);
    const selectedCharacter = ref(null);
    const battleResult = ref('');
    const fixtures = ref([]);
    const fixturesLoading = ref(false);
    const fixturesError = ref(null);
    
    const characters = [
      { name: 'Knight of Ether', emoji: '🛡️' },
      { name: 'Flame Caster', emoji: '🔥' },
      { name: 'Shadow Hacker', emoji: '🌀' }
    ];

    const opponents = ref([]); // Removed mock data since we're using fixtures now

    function shortenAddress(address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    function handleChallenge(fixture) {
      if (!walletConnected.value || !selectedCharacter.value) return;
      
      battleResult.value = `⚽ Preparing challenge for ${fixture.teams.home.name} vs ${fixture.teams.away.name}...`;
      
      // Simulate battle outcome after delay
      setTimeout(() => {
        const outcomes = [
          `🏆 ${selectedCharacter.value.name} won betting on ${fixture.teams.home.name}!`,
          `🏆 ${selectedCharacter.value.name} won betting on ${fixture.teams.away.name}!`,
          `💀 ${selectedCharacter.value.name} lost betting on ${fixture.teams.home.name}!`,
          `💀 ${selectedCharacter.value.name} lost betting on ${fixture.teams.away.name}!`,
          `🤝 Match ended in a draw!`
        ];
        battleResult.value = outcomes[Math.floor(Math.random() * outcomes.length)];
        
        if (battleResult.value.includes('🏆')) {
          xp.value += 1;
        }
      }, 2000);
    }

    async function connectWallet() {
      if (!window.ethereum) {
        alert("Please install MetaMask or another Web3 wallet!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (!accounts?.length) {
          throw new Error("No accounts found");
        }

        const signer = await provider.getSigner();
        walletAddress.value = await signer.getAddress();
        walletConnected.value = true;

        // Handle account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          walletAddress.value = newAccounts[0] || '';
          walletConnected.value = !!newAccounts[0];
        });

      } catch (error) {
        console.error("Wallet connection error:", error);
        alert(`Connection failed: ${error.message}`);
      }
    }

    function selectCharacter(character) {
      if (!walletConnected.value) return;
      selectedCharacter.value = character;
    }

    async function fetchFixtures() {
      fixturesLoading.value = true;
      fixturesError.value = null;
      try {
        const response = await axios.get(
          'https://api-football-v1.p.rapidapi.com/v3/fixtures',
          {
            headers: {
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
              'x-rapidapi-key': 'api_key_here' // TODO: Replace with actual API key
            },
            params: {
              live: 'all'
            }
          }
        );
        fixtures.value = response.data.response;
      } catch (error) {
        fixturesError.value = error;
        console.error('Error fetching fixtures:', error);
      } finally {
        fixturesLoading.value = false;
      }
    }

    onMounted(() => {
      fetchFixtures();
    });

    return {
      walletConnected,
      walletAddress,
      xp,
      selectedCharacter,
      characters,
      opponents,
      battleResult,
      fixtures,         // Added here
      fixturesLoading,  // Added here
      fixturesError,    // Added here
      connectWallet,
      selectCharacter,
      handleChallenge,
      shortenAddress
    };
  }
};
</script>