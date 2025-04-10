<template>
  <section class="text-center py-20">
    <h1 class="text-5xl font-bold mb-4 animate-pulse">👑 Royal Rumble</h1>
    <p class="text-lg mb-6">Enter the blockchain arena. Choose your champion. Battle your friends.</p>
    <button 
      @click="connectWallet"
      class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md"
    >
      Connect Wallet
    </button>
    <p class="mt-4 text-green-400 text-sm">{{ walletAddress }}</p>
    <p class="mt-4 text-yellow-300 text-lg font-mono">🏅 Win Streak XP: {{ xp }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ethers } from 'ethers'
const emit = defineEmits(['wallet-connected'])

const walletAddress = ref('')
const xp = ref(0)

const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      walletAddress.value = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
      
      // Enable character cards by emitting event
      emit('wallet-connected')
    } catch (error) {
      walletAddress.value = 'Connection failed. Please try again.'
      console.error(error)
    }
  } else {
    walletAddress.value = 'MetaMask not detected. Please install it!'
  }
}
</script>