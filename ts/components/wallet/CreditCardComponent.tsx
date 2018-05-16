import * as React from "react";

import { Body, Card, Icon, Text } from "native-base";
import { Image } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { NavigationScreenProp, NavigationState } from "react-navigation";

import I18n from "../../i18n";

import { CreditCard } from "../../types/wallet/CreditCard";
import { CreditCardIcons } from "../../types/wallet/CreditCardType";
import { CreditCardStyle } from "../styles";

type Props = Readonly<{
  item: CreditCard;
  navigation: NavigationScreenProp<NavigationState>;
}>;

/**
 * Credit card component
 */
export default class CreditCardComponent extends React.Component<Props> {
  public render(): React.ReactNode {
    const { item } = this.props;
    const { navigate } = this.props.navigation;
    return (
      <Card style={CreditCardStyle.cardStyle}>
        <Body>
          <Grid>
            <Row size={2} style={CreditCardStyle.rowStyle}>
              <Col size={7}>
                <Text
                  style={[
                    CreditCardStyle.textStyle,
                    CreditCardStyle.largeTextStyle
                  ]}
                >
                  {("\u25cf".repeat(4) + " ").repeat(3) +
                    item.ccNumber.slice(-4)}
                </Text>
              </Col>
              <Col size={1}>
                <Icon
                  type="MaterialIcons"
                  active={false}
                  style={CreditCardStyle.iconStyle}
                  name="star-border"
                />
              </Col>
              <Col size={1}>
                <Icon
                  type="MaterialIcons"
                  active={true}
                  style={CreditCardStyle.iconStyle}
                  name="more-vert"
                />
              </Col>
            </Row>
            <Row size={1} style={CreditCardStyle.rowStyle}>
              <Col>
                <Text
                  style={[
                    CreditCardStyle.textStyle,
                    CreditCardStyle.smallTextStyle
                  ]}
                >
                  {I18n.t("creditCardComponent.validUntil") + item.expires}
                </Text>
              </Col>
            </Row>
            <Row
              size={2}
              style={[CreditCardStyle.rowStyle, CreditCardStyle.whiteBarStyle]}
            >
              <Col size={7}>
                <Text style={CreditCardStyle.textStyle}>
                  {item.owner.toUpperCase()}
                </Text>
              </Col>
              <Col size={2}>
                <Image
                  style={CreditCardStyle.issuerLogo}
                  source={
                    CreditCardIcons[CreditCard.getCardType(item.ccNumber)]
                  }
                />
              </Col>
              <Col size={1}>
                <Text>&nbsp;</Text>
              </Col>
            </Row>
            <Row
              style={CreditCardStyle.rowStyle}
              size={2}
              {...{
                onPress: (): boolean => navigate("")
              }}
            >
              <Col size={8}>
                <Text
                  style={[
                    CreditCardStyle.textStyle,
                    CreditCardStyle.smallTextStyle
                  ]}
                >
                  {item.lastUsage}
                </Text>
              </Col>
              <Col size={1}>
                <Icon
                  type="MaterialIcons"
                  style={CreditCardStyle.iconStyle}
                  name="keyboard-arrow-right"
                />
              </Col>
            </Row>
          </Grid>
        </Body>
      </Card>
    );
  }
}
