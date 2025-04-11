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
      <h2 class="text-3xl font-bold mb-8 text-center">🎯 Challenge a Player</h2>
      <div class="max-w-xl mx-auto space-y-4">
        <div 
          v-for="(player, index) in opponents" 
          :key="index"
          class="flex justify-between items-center bg-gray-800 p-4 rounded-xl shadow"
        >
          <span class="text-lg">{{ shortenAddress(player.address) }}</span>
          <button 
            @click="handleChallenge(player)"
            class="challenge-btn bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
            :disabled="!walletConnected || !selectedCharacter"
          >
            Challenge
          </button>
        </div>

        <section class="px-6 py-12 bg-gray-800 text-center">
          <h2 class="text-2xl font-bold mb-4">🥊 Battle Result</h2>
          <div class="text-xl text-yellow-400 font-mono animate-pulse">
            {{ battleResult || 'No battle yet.' }}
          </div>
        </section>
      </div>
    </section>
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
    const battleResult = ref('');
    
    const characters = [
      { name: 'Knight of Ether', emoji: '🛡️' },
      { name: 'Flame Caster', emoji: '🔥' },
      { name: 'Shadow Hacker', emoji: '🌀' }
    ];

    const opponents = ref([
      { address: '0x1234567890123456789012345678901234567890' },
      { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
      { address: '0xdef0123456789abcdef0123456789abcdef0123' }
    ]);

    function shortenAddress(address) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    function handleChallenge(opponent) {
      if (!walletConnected.value || !selectedCharacter.value) return;
      
      battleResult.value = '⚔️ Battle in progress...';
      
      // Simulate battle outcome after delay
      setTimeout(() => {
        const outcomes = [
          `🏆 You defeated ${shortenAddress(opponent.address)}!`,
          `💀 You were defeated by ${shortenAddress(opponent.address)}!`,
          `🤝 Draw against ${shortenAddress(opponent.address)}!`
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

    return {
      walletConnected,
      walletAddress,
      xp,
      selectedCharacter,
      characters,
      opponents,
      battleResult,
      connectWallet,
      selectCharacter,
      handleChallenge,
      shortenAddress
    };
  }
};
</script>