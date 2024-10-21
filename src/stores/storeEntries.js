import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uid, Notify } from 'quasar'

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

	const balance = computed(() => {
    /*
    let balance = 0
    entries.value.forEach(entry => {
      //console.log('entry: ', entry)
      balance = balance + entry.amount
    })
    return balance
    */

    // 2 способ решения:
    return entries.value.reduce((accumulator, { amount }) => {
      //console.log('accumulator: ', accumulator)
      //console.log('amount: ', amount)
      return accumulator + amount
    }, 0)
  })

	const addEntry = addEntryForm => {
		// const newEntry = {
    //   id: uid(),
    //   name: addEntryForm.name,
    //   amount: addEntryForm.amount
    // }
    //console.log('newEntry: ', newEntry)
		const newEntry = Object.assign({}, addEntryForm, { id: uid() })
		entries.value.push(newEntry)
	}

	const deleteEntry = entryId => {
    const index = entries.value.findIndex(entry => entry.id === entryId)
    //console.log('index: ', index)
    entries.value.splice(index, 1)
    Notify.create({
      message: 'Entry deleted',
      position: 'top'
    })
  }

  return { 
		
		// state
		entries, 
		
		// getters
		balance, 
		
		// actions
		addEntry,
		deleteEntry
	}

})
