<template>
  <div class="container mx-auto px-4">
    <HeroSection @wallet-connected="handleWalletConnected" />
    <CharacterSelector :wallet-connected="isWalletConnected" />
    <ChallengeList />
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeroSection from '@/components/HeroSection/HeroSection.vue'
import CharacterSelector from '@/components/CharacterSelector/CharacterSelector.vue'
import ChallengeList from '@/components/ChallengeList/ChallengeList.vue'
import Footer from '@/components/Footer/Footer.vue'

const isWalletConnected = ref(false)

const handleWalletConnected = () => {
  isWalletConnected.value = true
}
</script>
