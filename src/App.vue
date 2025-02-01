<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoreSettings } from './stores/storeSettings'
import { useStoreEntries } from './stores/storeEntries'

defineOptions({
  name: 'App'
});

const storeSettings = useStoreSettings(),
      useStoreEntries = useStoreEntries()

onMounted(() => {
  storeSettings.loadSettings()
  useStoreEntries.loadEntries()
})

window.addEventListener('contextmenu', e => {
	e.preventDefault()
})
</script>
