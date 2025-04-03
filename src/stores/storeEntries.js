import { defineStore } from 'pinia'
import { ref, reactive, computed, nextTick } from 'vue'
import { Notify } from 'quasar'
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'

const entriesCollectionRef = collection(db, 'entries')

export const useStoreEntries = defineStore('entries', () => {

	const entries = ref([
    // {
    //   id: 'id0',
    //   name: 'Salary',
    //   amount: 4999.99,
    //   paid: false
    // },
    // {
    //   id: 'id1',
    //   name: 'Rent',
    //   amount: -999,
    //   paid: false
    // },
    // {
    //   id: 'id2',
    //   name: 'Phone',
    //   amount: -14.99,
    //   paid: false
    // },
    // {
    //   id: 'id3',
    //   name: 'Unknown',
    //   amount: 0,
    //   paid: false
    // },
  ])

  const entriesLoaded = ref(false)

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

  const loadEntries = async () => {
    onSnapshot(entriesCollectionRef, (querySnapshot) => {
      entriesLoaded.value = false
      let entriesFB = []
      querySnapshot.forEach((doc) => {
        let entry = doc.data()
        entry.id = doc.id
        entriesFB.push(entry)
      })
      setTimeout(() => {
        entries.value = entriesFB
        entriesLoaded.value = true
      }, 1000)
    })
  }

  const addEntry = async addEntryForm => {
    const newEntry = Object.assign({}, addEntryForm, { paid: false })
    if (newEntry.amount === null) newEntry.amount = 0
    await addDoc(entriesCollectionRef, newEntry)
  }

  const deleteEntry = async entryId => {
    await deleteDoc(doc(entriesCollectionRef, entryId))
    removeSlideItemIfExists(entryId)
    Notify.create({
      message: 'Entry deleted',
      position: 'top'
    })
  }

  const updateEntry = async (entryId, updates) => {
    await updateDoc(doc(entriesCollectionRef, entryId), updates)
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

  const removeSlideItemIfExists = entryId => {
    /* hacky fix: 
      When deleting (after sorting), sometimes the slide item is not removed from the DOM. 
      This will remove the slide item from the DOM if it still exists
      (after entry removed from entries array). */
    nextTick(() => {
      const slideItem = document.querySelector(`#id-${ entryId }`)
      if (slideItem) slideItem.remove()
    })
  }



  return { 
		
		// state
		entries,
		entriesLoaded,
		options,
		
		// getters
		balance,
		balancePaid,
		runningBalances,
		
		// actions
		loadEntries,
		addEntry,
		deleteEntry,
		updateEntry,
		sortEnd,
	}

})
