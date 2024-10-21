import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStoreEntries = defineStore('entries', () => {

	const entries = ref([
    {
      id: 'id0',
      name: 'Salary',
      amount: 4999.99
    },
    {
      id: 'id1',
      name: 'Rent',
      amount: -999
    },
    {
      id: 'id2',
      name: 'Phone',
      amount: -14.99
    },
    {
      id: 'id3',
      name: 'Unknown',
      amount: 0
    },
  ])

  return { entries }
})
