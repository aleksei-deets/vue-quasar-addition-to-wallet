import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { uid, Notify } from 'quasar'

export const useStoreEntries = defineStore('entries', () => {

	const entries = ref([
    {
      id: 'id0',
      name: 'Salary',
      amount: 4999.99,
			paid: false
    },
    {
      id: 'id1',
      name: 'Rent',
      amount: -999,
			paid: false
    },
    {
      id: 'id2',
      name: 'Phone',
      amount: -14.99,
			paid: false
    },
    {
      id: 'id3',
      name: 'Unknown',
      amount: 0,
			paid: false
    },
  ])

	const options = reactive({
		sort: false
	})

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

	const balancePaid = computed(() => {
    return entries.value.reduce((accumulator, { amount, paid }) => {
			return paid ? accumulator + amount : accumulator
    }, 0)
  })

  const runningBalances = computed(() => {
    let runningBalances = [],
        currentRunningBalance = 0
    
    if (entries.value.length) {
      entries.value.forEach(entry => {
        let entryAmount = entry.amount ? entry.amount : 0
        currentRunningBalance = currentRunningBalance + entryAmount
        runningBalances.push(currentRunningBalance)
      })
    }
  
    return runningBalances
  })

	const addEntry = addEntryForm => {
		// const newEntry = {
    //   id: uid(),
    //   name: addEntryForm.name,
    //   amount: addEntryForm.amount
    // }
    //console.log('newEntry: ', newEntry)
		const newEntry = Object.assign({}, addEntryForm, { id: uid(), paid: false })
		entries.value.push(newEntry)
	}

	const deleteEntry = entryId => {
    const index = getEntryIndexById(entryId)
    //console.log('index: ', index)
    entries.value.splice(index, 1)
    Notify.create({
      message: 'Entry deleted',
      position: 'top'
    })
  }

	const updateEntry = (entryId, updates) => {
		const index = getEntryIndexById(entryId)
		Object.assign(entries.value[index], updates)
	}

	const sortEnd = ({ oldIndex, newIndex }) => {
		const movedEntry = entries.value[oldIndex]
		entries.value.splice(oldIndex, 1)
		entries.value.splice(newIndex, 0, movedEntry)
	}


	/*
		helpers
	*/

	const getEntryIndexById = entryId => {
		return entries.value.findIndex(entry => entry.id === entryId)
	}

  return { 
		
		// state
		entries,
		options,
		
		// getters
		balance,
		balancePaid,
		runningBalances,
		
		// actions
		addEntry,
		deleteEntry,
		updateEntry,
		sortEnd
	}

})
