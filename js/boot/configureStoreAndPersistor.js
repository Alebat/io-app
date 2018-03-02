// @flow

import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'
import { analytics } from '../middlewares'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import applyAppStateListener from '../enhancers/applyAppStateListener'
import rootReducer from '../reducers'

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['navigation']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const logger = createLogger({
  predicate: () => isDebuggingInChrome,
  collapsed: true,
  duration: true
})

/**
 * The new react-navigation if integrated with redux need a middleware
 * so that any events that mutate the navigation state properly trigger
 * the event listeners.
 * For details check @https://github.com/react-navigation/react-navigation/issues/3438.
 */
const navigation = createReactNavigationReduxMiddleware(
  // This is just a key to identify the Set of the listeners.
  // The same key will be used by the createReduxBoundAddListener function
  'root',
  // This is a selector to get the navigation state from the global state
  state => state.navigation
)

const configureStoreAndPersistor = () => {
  const enhancer = compose(
    applyAppStateListener(),
    applyMiddleware(
      thunk,
      logger,
      navigation,
      analytics.actionTracking,
      analytics.screenTracking
    )
  )

  const store = createStore(persistedReducer, {}, enhancer)
  const persistor = persistStore(store)

  if (isDebuggingInChrome) {
    window.store = store
  }

  return { store, persistor }
}

export default configureStoreAndPersistor
