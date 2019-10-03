import * as pot from "italia-ts-commons/lib/pot";
import { getType } from "typesafe-actions";

import {
  firstServicesLoad,
  loadVisibleServices
} from "../../../actions/services";
import { Action } from "../../../actions/types";
import {
  userMetadataLoad,
  userMetadataUpsert
} from "../../../actions/userMetadata";
import { GlobalState } from "../../types";

export type FirstLoadingState = Readonly<{
  isFirstServicesLoadingCompleted: pot.Pot<boolean, Error>;
}>;

const INITIAL_STATE: FirstLoadingState = {
  isFirstServicesLoadingCompleted: pot.none
};

// Reducer
export const firstLoadingReducer = (
  state: FirstLoadingState = INITIAL_STATE,
  action: Action
): FirstLoadingState => {
  switch (action.type) {
    case getType(firstServicesLoad.success): {
      return {
        isFirstServicesLoadingCompleted: pot.some(true)
      };
    }

    case getType(firstServicesLoad.failure): {
      return {
        isFirstServicesLoadingCompleted: pot.toError(
          state.isFirstServicesLoadingCompleted,
          action.payload
        )
      };
    }

    case getType(loadVisibleServices.failure): {
      if (pot.isNone(state.isFirstServicesLoadingCompleted)) {
        return {
          isFirstServicesLoadingCompleted: pot.toError(
            state.isFirstServicesLoadingCompleted,
            Error("Failed to load visibleServices")
          )
        };
      }
    }

    case getType(userMetadataLoad.failure): {
      if (pot.isNone(state.isFirstServicesLoadingCompleted)) {
        return {
          isFirstServicesLoadingCompleted: pot.toError(
            state.isFirstServicesLoadingCompleted,
            Error("Failed to load userMetadata")
          )
        };
      }
    }

    case getType(userMetadataUpsert.failure): {
      if (pot.isNone(state.isFirstServicesLoadingCompleted)) {
        return {
          isFirstServicesLoadingCompleted: pot.toError(
            state.isFirstServicesLoadingCompleted,
            Error("Failed to upsert userMetadata")
          )
        };
      }
    }

    default:
      return state;
  }
};

// Selectors
export const isFirstVisibleServiceLoadCompletedSelector = (
  state: GlobalState
): pot.Pot<boolean, Error> =>
  state.entities.services.firstLoading.isFirstServicesLoadingCompleted;