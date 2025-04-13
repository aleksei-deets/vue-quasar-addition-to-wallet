import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from 'src/firebase/firebase'
import { useStoreEntries } from 'src/stores/storeEntries'

export const useStoreAuth = defineStore('auth', () => {

  const userDetailsDefault = {
    id: null,
    email: null
  }

  const userDetails = reactive({
    ...userDetailsDefault
  })

  const init = () => {
    const router = useRouter(),
          storeEntries = useStoreEntries()
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('User logged in: ', user)
        userDetails.id = user.uid
        userDetails.email = user.email
        router.push('/')
        storeEntries.loadEntries()
      } else {
        // console.log('User logged out: ', user)
        Object.assign(userDetails, userDetailsDefault)
        router.replace('/auth')
      }
    })
  }

  const registerUser = ({ email, password }) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log('user : ', user)
      })
      .catch((error) => {
        showFirebaseError(error.message)
      });
  }

  const loginUser = ({ email, password }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log('user : ', user)
      })
      .catch((error) => {
        showFirebaseError(error.message)
      });
  }

  const logoutUser = () => {
    signOut(auth).then(() => {
      console.log('user was logged out')
    }).catch((error) => {
      showFirebaseError(error.message)
    });
  }


  /*
    helpers
  */

  const showFirebaseError = message => {
    Dialog.create({
      title: 'Error',
      message
    })
  }


  return {
      //state
    userDetails,
      //actions
    init,
    registerUser,
    loginUser,
    logoutUser
  }

})
