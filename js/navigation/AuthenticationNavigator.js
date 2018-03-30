// @flow

import { StackNavigator } from 'react-navigation'

import ROUTES from './routes'
import LandingScreen from '../screens/authentication/LandingScreen'
import IdpSelectionScreen from '../screens/authentication/IdpSelectionScreen'
import IdpLoginScreen from '../screens/authentication/IdpLoginScreen'
import LoginScreen from '../screens/authentication/LoginScreen'

/**
 * The authentication related stack of screens of the application.
 */
const navigator = StackNavigator(
  {
    [ROUTES.AUTHENTICATION_LANDING]: {
      screen: LandingScreen
    },
    [ROUTES.AUTHENTICATION_IDP_SELECTION]: {
      screen: IdpSelectionScreen
    },
    [ROUTES.AUTHENTICATION_IDP_LOGIN]: {
      screen: IdpLoginScreen
    },
    [ROUTES.AUTHENTICATION_LOGIN]: {
      screen: LoginScreen
    }
  },
  {
    // Let each screen handle the header and navigation
    headerMode: 'none'
  }
)

export default navigator
