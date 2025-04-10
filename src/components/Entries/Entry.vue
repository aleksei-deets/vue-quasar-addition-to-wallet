<template>
  <q-slide-item 
    :id="`id-${ entry.id }`"
    @left="onEntrySlideLeft"
    @right="onEntrySlideRight"
    left-color="positive"
    right-color="negative"
    :class="
      !entry.paid
        ? useLightOrDark('bg-white', 'bg-black')
        : useLightOrDark('bg-grey-2', 'bg-grey-9')
    "
  >
    <template v-slot:left>
      <q-icon name="done" />
    </template>
    <template v-slot:right>
      <q-icon name="delete" />
    </template>
    
    <q-item
      class="row"
    >
      <q-item-section
        class="text-weight-bold col"
        :class="[
          useAmountColorClass(entry.amount),
          { 'text-strike' : entry.paid }
        ]"
      >
        {{ entry.name }}
        <!-- in <q-popup-edit> component use :model-value instead v-model.
              To prevent the possibility of changing the data in the Pinia store. -->
        <!-- To Fix issue with offset style prop in QPopupEdit component
              added cover position prop, and set that to "false". -->
        <q-popup-edit
          :model-value="entry.name"
          auto-save
          @save="onNameUpdate"
          v-slot="scope"
          buttons
          label-set="Ok"
          :cover="false"
          anchor="top left"
          :offset="[16, 12]"
        >
          <q-input
            v-model="scope.value"
            @keyup.enter="scope.set"
            autofocus
            v-select-all
            dense
            input-class="text-weight-bold letter-spacing-none"
          />
        </q-popup-edit>
      </q-item-section>
      
      <q-item-section 
        side
        class="text-weight-bold relative-position col"
        :class="[
          useAmountColorClass(entry.amount),
        ]"
      >
        <span
          :class="{ 'text-strike' : entry.paid }"
        >
          {{ useCurrencify(entry.amount) }}
        </span>
        <q-popup-edit
          :model-value="entry.amount"
          auto-save
          @save="onAmountUpdate"
          v-slot="scope"
          buttons
          label-set="Ok"
          :cover="false"
          anchor="top right"
          self="top right"
          :offset="[16, 12]"
        >
          <q-input
            v-model.number="scope.value"
            @keyup.enter="scope.set"
            autofocus
            v-select-all
            type="number"
            step="0.01"
            dense
            input-class="text-weight-bold letter-spacing-none text-right"
          />
        </q-popup-edit>
        <q-chip
          v-if="storeSettings.settings.showRunningBalance"
          icon="event"
          dense
          size="9px"
          class="running-balance absolute-bottom-right"
          :class="useAmountColorClass(storeEntries.runningBalances[index])"
        >
          {{ useCurrencify(storeEntries.runningBalances[index]) }}
        </q-chip>
      </q-item-section>
      
      <q-item-section
        v-if="storeEntries.options.sort"
        side
      >
        <q-icon
          name="reorder"
          class="handle"
          color="primary"
        />
      </q-item-section>
      
    </q-item>
  </q-slide-item>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useStoreSettings } from 'src/stores/storeSettings'
import { useCurrencify } from 'src/use/useCurrencify'
import { useAmountColorClass } from 'src/use/useAmountColorClass'
import { useLightOrDark } from 'src/use/useLightOrDark'
import vSelectAll from 'src/directives/directiveSelectAll'

const props = defineProps({
  entry: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
})

const $q = useQuasar()

const storeEntries = useStoreEntries(),
      storeSettings = useStoreSettings()

const onEntrySlideLeft = ({ reset }) => {
  storeEntries.updateEntry(props.entry.id, { paid: !props.entry.paid })
  reset()
}

const onEntrySlideRight = ({ reset }) => {
  // console.log('right')
  if (storeSettings.settings.promptToDelete) promptToDelete(reset)
  else storeEntries.deleteEntry(props.entry.id)
}

const promptToDelete = reset => {
  $q.dialog({
    title: "Delete entry",
    message: `
      Delete this entry?
      <div class="q-mt-md text-weight-bold ${useAmountColorClass(
        props.entry.amount
      )}">
        ${props.entry.name} : ${useCurrencify(props.entry.amount)} 
      </div>
    `,
    cancel: true,
    persistent: true,
    html: true,
    ok: {
      label: "Delete",
      color: "negative",
      noCaps: true,
    },
    cancel: {
      color: "primary",
      noCaps: true,
    },
  })
    .onOk(() => {
      storeEntries.deleteEntry(props.entry.id)
    })
    .onCancel(() => {
      reset()
    })
}

/*
  name & amount update

  Created 2 methods to ensure that the name and amount are updated correctly, keeping the desired type: 
  for the name it is a string, and for the amount it is a number.
*/

const onNameUpdate = value => {
  storeEntries.updateEntry(props.entry.id, { name: value })
}

const onAmountUpdate = value => {
  storeEntries.updateEntry(props.entry.id, { amount: value })
}

</script>
