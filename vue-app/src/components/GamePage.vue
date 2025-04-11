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

    <!-- Rest of the template sections would go here -->
  </div>
</template>

<script>
import { ref } from 'vue';
import { ethers } from 'ethers';

export default {
  setup() {
    const walletConnected = ref(false);
    const walletAddress = ref('');
    const xp = ref(0);
    const selectedCharacter = ref(null);
    
    const characters = [
      { name: 'Knight of Ether', emoji: '🛡️' },
      { name: 'Flame Caster', emoji: '🔥' },
      { name: 'Shadow Hacker', emoji: '🌀' }
    ];

    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          walletAddress.value = await signer.getAddress();
          walletConnected.value = true;
        } catch (error) {
          console.error("Error connecting wallet:", error);
          alert("Failed to connect wallet. Please try again.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    }

    function selectCharacter(character) {
      if (!walletConnected.value) return;
      selectedCharacter.value = character;
    }

    return {
      walletConnected,
      walletAddress,
      xp,
      selectedCharacter,
      characters,
      connectWallet,
      selectCharacter
    };
  }
};
</script>