import * as React from "react";

import { format } from "date-fns";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { Icon, Left, ListItem, Right, Text } from "native-base";
import { connectStyle } from "native-base-shoutem-theme";
import mapPropsToStyleNames from "native-base/src/Utils/mapPropsToStyleNames";
import I18n from "../i18n";
import { ServicesState } from "../store/reducers/entities/services";

export type OwnProps = {
  sender: string;
  subject: string;
  key: string;
  date: string;
  services: Readonly<ServicesState>;
};

export type Props = OwnProps;

/**
 * Implements a component that show a message in the MessagesScreen List
 */
class MessageComponent extends React.Component<Props> {
  public formatDate(date: string): string {
    const distance = distanceInWordsToNow(new Date(date));
    if (
      distance.includes("hours") === true ||
      distance.includes("hour") === true ||
      distance.includes("minutes ") === true ||
      distance.includes("minute") === true ||
      distance.includes("seconds") === true
    ) {
      return format(new Date(date), "H.mm");
    } else if (distance.includes("1 day") === true) {
      return I18n.t("messages.yesterday");
    } else if (
      distance.includes("year") === true ||
      distance.includes("years") === true
    ) {
      return format(new Date(date), "D/MM/YY");
    } else {
      return format(new Date(date), "DD/MM");
    }
  }

  public getSenderName(senderId: string, services: ServicesState): string {
    return services.byId[senderId].organization_name;
  }

  public render() {
    const { subject, sender, date, key, services } = this.props;
    return (
      <ListItem key={key}>
        <Left>
          <Text leftAlign={true} boldSender={true}>
            {this.getSenderName(sender, services)}
          </Text>
          <Text leftAlign={true}>{subject}</Text>
        </Left>
        <Right>
          <Text dateFormat={true}>{this.formatDate(date)}</Text>
          <Icon rightArrow={true} name="chevron-right" />
        </Right>
      </ListItem>
    );
  }
}

const StyledMessageComponent = connectStyle(
  "NativeBase.MessageComponent",
  {},
  mapPropsToStyleNames
)(MessageComponent);
export default StyledMessageComponent;
