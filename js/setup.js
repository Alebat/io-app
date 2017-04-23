/**
 * Modulo principale di setup dell'applicazione.
 *
 * Questo modulo inizializza lo store e il navigator.
 *
 * @flow
 */

'use strict'

import React from 'react'

import { Provider } from 'react-redux'
import { StackNavigator } from 'react-navigation'

import { StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'
import commonColors from '../native-base-theme/variables/commonColor'

import configureStore from './store/configureStore'
import LoginScreen from './components/LoginScreen'
import ProfileScreen from './components/ProfileScreen'

class Root extends React.Component {

  state: {
    isLoading: boolean,
    store: any,
  };

  constructor() {
    super()

    const store = configureStore(() => this.setState({
      isLoading: false
    }))

    this.state = {
      isLoading: true,
      store: store,
    }
  }

  render() {
    if (this.state.isLoading) {
      return null
    }

    // Usiamo un navigator a stack come default
    const Navigator = StackNavigator({
      Home: {
        screen: LoginScreen,
      },

      Profile: {
        screen: ProfileScreen,
      }
    }, {
      initialRouteName: this.state.store.getState().user.profile ? 'Profile' : 'Home',

      // L'header viene gestito dagli screen
      headerMode: 'none'
    })

    return (
      <StyleProvider style={getTheme(commonColors)}>
        <Provider store={this.state.store}>
          <Navigator />
        </Provider>
      </StyleProvider>
    )
  }
}

module.exports = () => Root
