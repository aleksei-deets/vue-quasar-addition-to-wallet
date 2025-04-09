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
        <q-form>
          <q-input
            label="Email"
            type="email"
            autocomplete="email"
            filled
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
          />
          <q-input
            label="Password"
            type="password"
            autocomplete="current-password"
            filled
            class="q-mb-md"
            :bg-color="useLightOrDark('white', 'black')"
          />
          <q-btn
            :label="submitButtonTitle"
            to="/"
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
import { ref, computed } from 'vue'
import ToolbarTitle from 'src/components/Layout/ToolbarTitle.vue'
import { useLightOrDark } from 'src/use/useLightOrDark'

const tab = ref('login')

const submitButtonTitle = computed(() => {
  return tab.value === 'login' ? 'Login' : 'Register'
})

</script>
