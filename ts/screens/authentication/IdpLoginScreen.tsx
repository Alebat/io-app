import { Text, View } from "native-base";
import * as React from "react";
import { NavState, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";

import * as t from "io-ts";
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

const RequestState = t.union([
  t.literal("loading"),
  t.literal("completed"),
  t.literal("hasError")
]);
type RequestState = t.TypeOf<typeof RequestState>;

type State = {
  requestState: RequestState;
};

const LOGIN_BASE_URL = `${
  config.apiUrlPrefix
}/login?authLevel=SpidL2&entityID=`;

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
  errorsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
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
      requestState: "loading"
    };
  }

  public render() {
    const { loggedOutWithIdpAuth, loggedInAuth } = this.props;
    const hasError = this.state.requestState === "hasError";

    if (loggedInAuth) {
      return <IdpSuccessfulAuthentication />;
    }

    if (!loggedOutWithIdpAuth) {
      // FIXME: perhaps as a safe bet, navigate to the IdP selection screen on mount?
      return null;
    }
    const loginUri = LOGIN_BASE_URL + loggedOutWithIdpAuth.idp.entityID;

    const handleOnError = (): void => {
      this.setState({
        requestState: "hasError"
      });
    };

    const handleNavigationStateChange = (event: NavState): void => {
      this.setState({
        requestState: event.loading ? "loading" : "completed"
      });

      onNavigationStateChange(
        () => this.props.dispatch(loginFailure()),
        token => this.props.dispatch(loginSuccess(token))
      )(event);
    };

    const renderMask = () => {
      switch (this.state.requestState) {
        case "hasError":
          return (
            <View style={styles.errorsContainer}>
              <Text>ERROR</Text>
            </View>
          );
        case "loading":
          return (
            <View style={styles.refreshIndicatorContainer}>
              <RefreshIndicator />
            </View>
          );
        default:
          return null;
      }
    };

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
            onError={handleOnError}
            javaScriptEnabled={true}
            onNavigationStateChange={handleNavigationStateChange}
          />
        )}
        {renderMask()}
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
