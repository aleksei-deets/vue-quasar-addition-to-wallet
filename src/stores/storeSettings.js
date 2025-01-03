import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useStoreSettings = defineStore('settings', () => {

	const settings = reactive({
		promptToDelete: true,
		showRunningBalance: true
	})

  return { 
		settings
	}
})
