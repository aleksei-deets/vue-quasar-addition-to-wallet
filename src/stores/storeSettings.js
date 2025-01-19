import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { Dark } from 'quasar'

export const useStoreSettings = defineStore('settings', () => {

	const settings = reactive({
		promptToDelete: true,
		showRunningBalance: false,
		currencySymbol: '$',
		darkMode: false
	})

  watch(() => settings.darkMode, value => {
    //console.log('value : ', value)
    Dark.set(value)
  }, { immediate: true })

  return { 
		settings
	}
})
