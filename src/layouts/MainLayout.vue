<template>
  <q-layout view="hHh lpR lFf">
    <q-header 
      :elevated="useLightOrDark(true, false)"
    >
      <q-toolbar>
        <q-btn
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
          dense
          flat
          round
        />
        
        <ToolbarTitle />
        
        <q-btn
          v-if="$route.fullPath === '/'"
          @click="storeEntries.options.sort = !storeEntries.options.sort"
          no-caps
          :label="!storeEntries.options.sort ? 'Sort' : 'Done'"
          dense
          flat
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="767"
      :width="250"
      bordered
      class="bg-primary"
    >
      <q-list>
        <q-item-label
          header
          class="text-white"
        >
          Navigation
        </q-item-label>
        
        <NavLink
          v-for="link in navLinks"
          v-bind="link"
          :key="link.title"
        />
        
        <q-separator spaced />
        
        <q-item
          @click="storeAuth.logoutUser"
          to="/auth"
          clickable
          tag="a"
          class="text-white"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          
          <q-item-section>
            <q-item-label>
              Log out
            </q-item-label>
          </q-item-section>
        </q-item>
        
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreEntries } from 'src/stores/storeEntries'
import { useStoreAuth } from 'src/stores/storeAuth'
import NavLink from 'components/Nav/NavLink.vue'
import ToolbarTitle from 'src/components/Layout/ToolbarTitle.vue'
import { useLightOrDark } from 'src/use/useLightOrDark'

defineOptions({
  name: 'MainLayout'
})

const storeEntries = useStoreEntries(),
      storeAuth = useStoreAuth()

const navLinks = [
  {
    title: 'Entries',
    icon: 'savings',
    link: '/'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
