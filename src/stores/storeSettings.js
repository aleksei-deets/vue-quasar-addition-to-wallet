import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { Dark, LocalStorage } from 'quasar'

export const useStoreSettings = defineStore('settings', () => {

	const settings = reactive({
		promptToDelete: true,
		showRunningBalance: false,
		currencySymbol: '$',
		darkMode: false	// false | true | "auto"
	})

  watch(() => settings.darkMode, value => {
    // console.log('value : ', value)
    Dark.set(value)
  }, { immediate: true })

  watch(settings, () => {
    saveSettings()
  })

  const saveSettings = () => {
    LocalStorage.set('settings', settings)
  }

  const loadSettings = () => {
    const savedSettings = LocalStorage.getItem('settings')
    if (savedSettings) Object.assign(settings, savedSettings)
  }

  return {

    // state
    settings,

    // actions
    loadSettings
  }
})
