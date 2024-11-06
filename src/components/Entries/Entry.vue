<template>
	<q-slide-item 
		@right="onEntrySlideRight"
		left-color="positive"
		right-color="negative"
	>
		<!-- <template v-slot:left>
			<q-icon name="done" />
		</template> -->
		<template v-slot:right>
			<q-icon name="delete" />
		</template>

		<q-item>
			<q-item-section
				class="text-weight-bold"
				:class="useAmountColorClass(entry.amount)"
			>
				{{ entry.name }}
				<!-- in <q-popup-edit> component use :model-value instead v-model. 
							To prevent the possibility of changing the data in the Pinia store. -->
				<!-- To Fix issue with offset style prop in QPopupEdit component
							added cover position prop, and set that to "false". -->
				<q-popup-edit 
					style="opacity: 0.5"
					:model-value="entry.name"
					auto-save 
					v-slot="scope"
					anchor="top left"
					:offset="[16, 12]"
					:cover="false"
				>	
        	<q-input 
						v-model="scope.value" 
						dense 
						autofocus 
						counter 
						@keyup.enter="scope.set" 
						input-class="text-weight-bold letter-spacing-none"
					/>
      	</q-popup-edit>
			</q-item-section>

			<q-item-section 
				side
				class="text-weight-bold"
				:class="useAmountColorClass(entry.amount)"
			>
				{{ useCurrencify(entry.amount) }}
			</q-item-section>
		</q-item>

	</q-slide-item>
</template>

<script setup>

import { useQuasar } from 'quasar'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useCurrencify } from 'src/use/useCurrencify'
import { useAmountColorClass } from 'src/use/useAmountColorClass'

const storeEntries = useStoreEntries()

const props = defineProps({
	entry: {
		type: Object,
		required: true
	}
})

const $q = useQuasar()


const onEntrySlideRight = ({ reset }) => {
	//console.log('right')
	$q.dialog({
			title: 'Delete entry',
			message: `
				Delete this entry?
				<div class="q-mt-md text-weight-bold ${ useAmountColorClass(props.entry.amount) }">
					${ props.entry.name } : ${ useCurrencify(props.entry.amount) } 
				</div>
			`,
			cancel: true,
			persistent: true,
			html: true,
			ok: {
				label: 'Delete',
				color: 'negative',
				noCaps: true
			},
			cancel: {
				color: 'primary',
				noCaps: true
			},
		}).onOk(() => {
			storeEntries.deleteEntry(props.entry.id)
		}).onCancel(() => {
			reset()
		})
}

</script>