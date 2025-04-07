<template>
  <q-form 
    @submit="addEntryFormSubmit"
    class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary"
  >
    <div class="col">
      <q-input 
        ref="nameRef"
        v-model="addEntryForm.name"
        placeholder="Name"
        v-select-all
        dense
        outlined
        :bg-color="useLightOrDark('white', 'black')"
      />
    </div>
    <div class="col">
      <q-input
        v-model.number="addEntryForm.amount"
        placeholder="Amount"
        v-select-all
        type="number"
        step="0.01"
        dense
        outlined
        input-class="text-right"
        :bg-color="useLightOrDark('white', 'black')"
      />
    </div>
    <div class="col col-auto">
      <q-btn 
        type="submit"
        icon="add"
        round
        color="primary"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useLightOrDark } from 'src/use/useLightOrDark'
import vSelectAll from 'src/directives/directiveSelectAll'

const storeEntries = useStoreEntries()

const nameRef = ref(null)

const addEntryFormDefault = {
  name: '',
  amount: null
}

const addEntryForm = reactive({
  ...addEntryFormDefault
})

const addEntryFormReset = () => {
  Object.assign(addEntryForm, addEntryFormDefault)
  nameRef.value.focus()
}

const addEntryFormSubmit = () => {
  storeEntries.addEntry(addEntryForm)
  addEntryFormReset()
}

</script>
