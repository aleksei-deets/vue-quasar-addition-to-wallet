<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoreSettings } from './stores/storeSettings'
import { useStoreAuth } from './stores/storeAuth'

defineOptions({
  name: 'App'
});

const storeSettings = useStoreSettings(),
      storeAuth = useStoreAuth()

onMounted(() => {
  storeAuth.init()
  storeSettings.loadSettings()
})

window.addEventListener('contextmenu', e => {
  e.preventDefault()
})
</script>
