import * as React from 'react'
import ROUTES from '../../navigation/routes'
import I18n from '../../i18n'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { Image, TouchableHighlight } from 'react-native'
import { Content, View } from 'native-base'
import { PortfolioStyles } from '../../components/styles'
import { OperationsList } from '../../components/portfolio/OperationsComponent'
import { PortfolioAPI } from '../../api/portfolio/portfolio-api'
import { Operation } from '../../types/portfolio/types'
import { PayLayout } from '../../components/portfolio/PayLayout'

type Props = {
  navigation: NavigationScreenProp<NavigationState>
}

/**
 * Portfolio Home Screen
 */
export class PortfolioHomeScreen extends React.Component<Props, never> {
  static navigationOptions = {
    title: I18n.t("portfolio.portfolio"),
    headerBackTitle: null
  }

  constructor(props: Props) {
    super(props)
  }

  public render(): React.ReactNode {
    const TITLE = I18n.t("portfolio.portfolio")
    const latestOperations: ReadonlyArray<
      Operation
    > = PortfolioAPI.getLatestOperations()
    return (
      <PayLayout
        navigation={this.props.navigation}
        title={TITLE}
        subtitleLeft={I18n.t("portfolio.paymentMethods")}
        subtitleRight={I18n.t("portfolio.add")}
        touchableContent={this.touchableContent()}
      >
        <Content style={PortfolioStyles.pfwhite}>
          <OperationsList
            parent={I18n.t("portfolio.portfolio")}
            title={I18n.t("portfolio.lastOperations")}
            totalAmount={I18n.t("portfolio.total")}
            operations={latestOperations}
            navigation={this.props.navigation}
          />
        </Content>
      </PayLayout>
    )
  }

  private touchableContent(): React.ReactElement<any> {
    const { navigate } = this.props.navigation
    return (
      <View style={PortfolioStyles.container}>
        <TouchableHighlight
          onPress={(): boolean =>
            navigate(ROUTES.PORTFOLIO_CREDITCARDS)
          }
        >
          <Image style={PortfolioStyles.pfcards}
                 source={require("../../../img/portfolio/creditcards.jpg")} />
        </TouchableHighlight>
      </View>
    )
  }
}
