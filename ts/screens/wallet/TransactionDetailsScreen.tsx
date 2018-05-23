import * as React from "react";

import { Button, Content, Left, Right, Text, View } from "native-base";
import { Image } from "react-native";
import { Grid, Row } from "react-native-easy-grid";
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";

import { WalletLayout } from "../../components/wallet/layout/WalletLayout";
import { topContentTouchable } from "../../components/wallet/layout/types";
import { WalletStyles } from "../../components/styles/wallet";
import I18n from "../../i18n";
import { CreditCard } from "../../types/CreditCard";
import { WalletTransaction } from "../../types/wallet";

const cardsImage = require("../../../img/portfolio/single-tab.png");

interface ParamType {
  readonly transaction: WalletTransaction;
}

interface StateParams extends NavigationState {
  readonly params: ParamType;
}

type OwnProps = Readonly<{
  navigation: NavigationScreenProp<StateParams>;
  transaction: WalletTransaction;
  parent: string;
  card: CreditCard;
}>;

type Props = OwnProps & NavigationInjectedProps;

/**
 * Details of transaction
 */
export class TransactionDetailsScreen extends React.Component<Props, never> {
  public static navigationOptions = {
    title: I18n.t("wallet.operationsDetails"),
    headerBackTitle: null
  };

  constructor(props: Props) {
    super(props);
  }

  private touchableContent(): React.ReactElement<any> {
    return (
      <View style={WalletStyles.container}>
        <Image
          style={WalletStyles.pfSingle}
          source={cardsImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  public render(): React.ReactNode {
    const { navigate } = this.props.navigation;
    const operation: WalletTransaction = this.props.navigation.state.params.transaction;
    const topContent = topContentTouchable(this.touchableContent());
    return (
      <WalletLayout
        headerTitle={I18n.t("wallet.transaction")}
        allowGoBack={true}
        navigation={this.props.navigation}
        title={I18n.t("wallet.transactionDetails")}
        topContent={topContent}
      >
        <Content style={WalletStyles.whiteContent}>
          <Grid>
            <Row>
              <Left>
                <Text>
                  {`${I18n.t("wallet.total")} ${operation.currency}`}
                </Text>
              </Left>
              <Right>
                <Text style={WalletStyles.boldStyle}>
                  {operation.amount}
                </Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text note={true}>{I18n.t("wallet.payAmount")}</Text>
              </Left>
              <Right>
                <Text>{operation.amount}</Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text>
                  <Text note={true}>{I18n.t("wallet.transactionFee")}</Text>
                  <Text note={true}>&nbsp;</Text>
                  <Text note={true} style={WalletStyles.whyLink}>
                    {I18n.t("wallet.why")}
                  </Text>
                </Text>
              </Left>
              <Right>
                <Text>{operation.transactionCost}</Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text note={true}>{I18n.t("wallet.causal")}</Text>
              </Left>
              <Right>
                <Text style={WalletStyles.boldStyle}>
                  {operation.subject}
                </Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text note={true}>{I18n.t("wallet.recipient")}</Text>
              </Left>
              <Right>
                <Text style={WalletStyles.boldStyle}>
                  {operation.recipient}
                </Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text note={true}>{I18n.t("wallet.date")}</Text>
              </Left>
              <Right>
                <Text>{operation.date}</Text>
              </Right>
            </Row>
            <Row>
              <Left>
                <Text note={true}>{I18n.t("wallet.hour")}</Text>
              </Left>
              <Right>
                <Text>{operation.time}</Text>
              </Right>
            </Row>
            <Row>
              <Button
                style={{ marginTop: 20 }}
                block={true}
                success={true}
                onPress={(): boolean => navigate("Login")}
              >
                <Text>{I18n.t("wallet.seeReceipt")}</Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </WalletLayout>
    );
  }
}
