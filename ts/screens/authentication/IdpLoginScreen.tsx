import { Button, Text, View } from "native-base";
import * as React from "react";
import { Image, NavState, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";

import * as pot from "italia-ts-commons/lib/pot";
import { IdpSuccessfulAuthentication } from "../../components/IdpSuccessfulAuthentication";
import BaseScreenComponent from "../../components/screens/BaseScreenComponent";
import { RefreshIndicator } from "../../components/ui/RefreshIndicator";
import * as config from "../../config";
import I18n from "../../i18n";
import { loginFailure, loginSuccess } from "../../store/actions/authentication";
import { ReduxProps } from "../../store/actions/types";
import {
  isLoggedIn,
  isLoggedOutWithIdp
} from "../../store/reducers/authentication";
import { GlobalState } from "../../store/reducers/types";
import { SessionToken } from "../../types/SessionToken";
import { extractLoginResult } from "../../utils/login";

type OwnProps = {
  navigation: NavigationScreenProp<NavigationState>;
};

type Props = ReturnType<typeof mapStateToProps> & ReduxProps & OwnProps;

type RequestState = pot.Pot<string, string>;

type State = {
  requestState: RequestState;
};

const LOGIN_BASE_URL = `${
  config.apiUrlPrefix
}/login?authLevel=SpidL2&entityID=`;

const brokenLinkImage = require("../../../img/broken-link.png");

const styles = StyleSheet.create({
  refreshIndicatorContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  errorContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  errorTitle: {
    fontSize: 20,
    marginTop: 10
  },
  errorBody: { marginTop: 10, marginBottom: 10, textAlign: "center" },
  errorButtonsContainer: {
    position: "absolute",
    bottom: 30,
    flex: 1,
    flexDirection: "row"
  }
});

const onNavigationStateChange = (
  onFailure: () => void,
  onSuccess: (_: SessionToken) => void
) => (navState: NavState) => {
  // Extract the login result from the url.
  // If the url is not related to login this will be `null`
  if (navState.url) {
    const loginResult = extractLoginResult(navState.url);
    if (loginResult) {
      if (loginResult.success) {
        // In case of successful login
        onSuccess(loginResult.token);
      } else {
        // In case of login failure
        onFailure();
      }
    }
  }
};

/**
 * A screen that allow the user to login with an IDP.
 * The IDP page is opened in a WebView
 */
class IdpLoginScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      requestState: pot.noneLoading
    };
  }

  private handleOnError = (): void =>
    this.setState({
      requestState: pot.noneError("error")
    });

  private goBack = this.props.navigation.goBack;

  private setRequestStateToLoading = () =>
    this.setState({ requestState: pot.noneLoading });

  private handleNavigationStateChange = (event: NavState): void => {
    this.setState({
      requestState: event.loading
        ? pot.someLoading("loading")
        : pot.some("loading complete")
    });

    onNavigationStateChange(
      () => this.props.dispatch(loginFailure()),
      token => this.props.dispatch(loginSuccess(token))
    )(event);
  };

  private renderMask = () => {
    if (pot.isLoading(this.state.requestState)) {
      return (
        <View style={styles.refreshIndicatorContainer}>
          <RefreshIndicator />
        </View>
      );
    } else if (pot.isError(this.state.requestState)) {
      return (
        <View style={styles.errorContainer}>
          <Image source={brokenLinkImage} resizeMode="contain" />
          <Text style={styles.errorTitle} bold={true}>
            {I18n.t("authentication.errors.network.title")}
          </Text>
          <Text style={styles.errorBody}>
            {I18n.t("authentication.errors.network.body")}
          </Text>
          <View style={styles.errorButtonsContainer}>
            <Button
              onPress={this.goBack}
              style={{ flex: 1 }}
              block={true}
              light={true}
            >
              <Text>{I18n.t("global.buttons.cancel")}</Text>
            </Button>
            <Button
              onPress={this.setRequestStateToLoading}
              style={{ flex: 2 }}
              block={true}
              primary={true}
            >
              <Text>{I18n.t("global.buttons.retry")}</Text>
            </Button>
          </View>
        </View>
      );
    }
    // loading complete, no mask needed
    return null;
  };

  public render() {
    const { loggedOutWithIdpAuth, loggedInAuth } = this.props;
    const hasError = pot.isError(this.state.requestState);

    if (loggedInAuth) {
      return <IdpSuccessfulAuthentication />;
    }

    if (!loggedOutWithIdpAuth) {
      // FIXME: perhaps as a safe bet, navigate to the IdP selection screen on mount?
      return null;
    }
    const loginUri = LOGIN_BASE_URL + loggedOutWithIdpAuth.idp.entityID;

    return (
      <BaseScreenComponent
        goBack={true}
        headerTitle={`${I18n.t("authentication.idp_login.headerTitle")} - ${
          loggedOutWithIdpAuth.idp.name
        }`}
      >
        {!hasError && (
          <WebView
            source={{ uri: loginUri }}
            onError={this.handleOnError}
            javaScriptEnabled={true}
            onNavigationStateChange={this.handleNavigationStateChange}
          />
        )}
        {this.renderMask()}
      </BaseScreenComponent>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  loggedOutWithIdpAuth: isLoggedOutWithIdp(state.authentication)
    ? state.authentication
    : undefined,
  loggedInAuth: isLoggedIn(state.authentication)
    ? state.authentication
    : undefined
});

export default connect(mapStateToProps)(IdpLoginScreen);
