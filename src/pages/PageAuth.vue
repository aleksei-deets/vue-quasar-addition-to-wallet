<template>
  <q-page class="flex flex-center">
    <q-card 
      class="auth bg-primary text-white q-pa-lg"
    >
      <q-card-section>
        <ToolbarTitle />
      </q-card-section>
      
      <q-card-section>
        <q-tabs
          v-model="tab"
          no-caps
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>
      </q-card-section>
      
      <q-card-section>
        <q-form
          @submit="formSubmit"
        >
          <q-input
            v-model="credentials.email"
            label="Email"
            type="email"
            autocomplete="email"
            filled
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
          />
          <q-input
            v-model="credentials.password"
            label="Password"
            type="password"
            autocomplete="current-password"
            filled
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
          />
          <q-btn
            :label="submitButtonTitle"
            type="submit"
            no-caps
            outline
            class="full-width"
            color="white"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useStoreAuth } from 'src/stores/storeAuth'
import ToolbarTitle from 'src/components/Layout/ToolbarTitle.vue'
import { useLightOrDark } from 'src/use/useLightOrDark'

const $q = useQuasar()

const storeAuth = useStoreAuth()

const tab = ref('login')

const credentials = reactive({
	email: '',
	password: ''
})

const submitButtonTitle = computed(() => {
  return tab.value === 'login' ? 'Login' : 'Register'
})

const formSubmit = () => {
  if (!credentials.email || !credentials.password) {
    $q.dialog({
      title: 'Error',
      message: 'Please enter an email & password'
    })
  }
  else {
    formSubmitSuccess()
  }
}

const formSubmitSuccess = () => {
  if (tab.value === 'register') {
    storeAuth.registerUser(credentials)
  }
  else {
    storeAuth.loginUser(credentials)
  }
}

</script>
