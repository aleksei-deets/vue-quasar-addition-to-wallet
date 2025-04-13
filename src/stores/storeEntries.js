import { defineStore } from 'pinia'
import { ref, reactive, computed, nextTick } from 'vue'
import { Notify } from 'quasar'
import { useStoreAuth } from 'src/stores/storeAuth'
import { collection, onSnapshot, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from 'src/firebase/firebase'

let entriesCollectionRef = null

export const useStoreEntries = defineStore('entries', () => {

  const entries = ref([
    // {
    //   id: 'id0',
    //   name: 'Salary',
    //   amount: 4999.99,
    //   paid: false,
    //   order: 1
    // },
    // {
    //   id: 'id1',
    //   name: 'Rent',
    //   amount: -999,
    //   paid: false,
    //   order: 2
    // },
    // {
    //   id: 'id2',
    //   name: 'Phone',
    //   amount: -14.99,
    //   paid: false,
    //   order: 3
    // },
    // {
    //   id: 'id3',
    //   name: 'Unknown',
    //   amount: 0,
    //   paid: false,
    //   order: 4
    // },
  ])

  const entriesLoaded = ref(false)

  const options = reactive({
    sort: false
  })

  const entriesOrdered = computed(() => {
    return entries.value.sort((a, b) => a.order - b.order)
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

  const init = () => {
    const storeAuth = useStoreAuth()
    entriesCollectionRef = collection(db, 'users', storeAuth.userDetails.id, 'entries')
    loadEntries()
  }

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
    const newEntry = Object.assign({}, addEntryForm, 
      { 
        paid: false,
        order: generateOrderNumber()
      }
    )
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

  const updateEntryOrderNumbers = () => {
    let currentOrder = 1
    entries.value.forEach(entry => {
      entry.order = currentOrder
      currentOrder++
    })

    entries.value.forEach(entry => {
      updateEntry(entry.id, { order: entry.order })
    })
  }

  const sortEnd = ({ oldIndex, newIndex }) => {
    const movedEntry = entries.value[oldIndex]
    entries.value.splice(oldIndex, 1)
    entries.value.splice(newIndex, 0, movedEntry)
    updateEntryOrderNumbers()
  }


  /*
    helpers
  */

  const generateOrderNumber = () => {
    const orderNumbers = entries.value.map(entry => entry.order)
    const newOrderNumber = orderNumbers.length
                           ? Math.max(...orderNumbers) + 1
                           : 1
    return newOrderNumber
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
    entriesOrdered,
    balance,
    balancePaid,
    runningBalances,
    
      // actions
    init,
    loadEntries,
    addEntry,
    deleteEntry,
    updateEntry,
    sortEnd,
  }

})
