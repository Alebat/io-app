import * as React from "react"
import { TabBarBottom, TabNavigator, NavigationStackScreenOptions } from "react-navigation"

import ROUTES from "./routes"
import MessagesScreen from "../screens/main/MessagesScreen"
import ProfileScreen from "../screens/main/ProfileScreen"
import PortfolioNavigator from "./PortfolioNavigator"
import { Icon } from "native-base"

interface IRouteIcons
{
  routeName: string,
  routeIcon: string
}

const ROUTE_ICON: ReadonlyArray<IRouteIcons> = [
  { routeName: ROUTES.MAIN_MESSAGES, routeIcon: "mail" },
  { routeName: ROUTES.PORTFOLIO_HOME, routeIcon: "wallet" },
  { routeName: ROUTES.DOCUMENTS_HOME, routeIcon: "document" },
  { routeName: ROUTES.PREFERENCES_HOME, routeIcon: "cog" },
  { routeName: ROUTES.MAIN_PROFILE, routeIcon: "user" }
]

/**
 * A navigator for all the screens used when the user is authenticated.
 */
const navigation = TabNavigator(
  {
    [ROUTES.MAIN_MESSAGES]: {
      screen: MessagesScreen
    },
    [ROUTES.PORTFOLIO_HOME]: {
      screen: PortfolioNavigator
    },
    [ROUTES.DOCUMENTS_HOME]: {
      screen: PortfolioNavigator
    },
    [ROUTES.PREFERENCES_HOME]: {
      screen: PortfolioNavigator
    },
    [ROUTES.MAIN_PROFILE]: {
      screen: ProfileScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        return <Icon name={ROUTE_ICON[routeName]} active={focused} />
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "black",
      inactiveTintColor: "gray"
    },
    animationEnabled: true,
    swipeEnabled: false,
    initialRouteName: ROUTES.MAIN_MESSAGES
  }
)

export default navigation
