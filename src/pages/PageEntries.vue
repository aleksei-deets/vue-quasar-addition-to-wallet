<template>
  <q-page>
    <div class="q-pa-md">
      <q-list
        bordered
        separator
      >
        <q-item
          v-for="entry in entries"
          :key="entry.id"
        >
          <q-item-section
            class="text-weight-bold"
            :class="useAmountColorClass(entry.amount)"
          >
            {{ entry.name }}
          </q-item-section>

          <q-item-section 
            side
            class="text-weight-bold"
            :class="useAmountColorClass(entry.amount)"
          >
            {{ useCurrencify(entry.amount) }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-footer
      class="bg-transparent"
    >
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">
          Balance
        </div>
        <div
          class="col text-h6 text-right"
          :class="useAmountColorClass(balance)"
        >
          {{ useCurrencify(balance) }}
        </div>
      </div>

      <div class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary">
        <div class="col">
          <q-input 
            v-model="addEntryForm.name"
            placeholder="Name"
            bg-color="white"
            outlined
            dense
          />
        </div>
        <div class="col">
          <q-input
            v-model="addEntryForm.amount"
            input-class="text-right"
            placeholder="Amount"
            bg-color="white"
            type="number"
            step="0.01"
            outlined
            dense
          />
        </div>
        <div class="col col-auto">
          <q-btn 
            color="primary"
            icon="add"
            round
          />
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup>

  import { ref, computed, reactive } from 'vue'
  import { useCurrencify } from 'src/use/useCurrencify'
  import { useAmountColorClass } from 'src/use/useAmountColorClass'

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
  
  const addEntryForm = reactive({
    name: '',
    amount: null
  })

</script>
