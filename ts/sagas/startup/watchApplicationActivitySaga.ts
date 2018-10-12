import { Effect, Task } from "redux-saga";
import { call, cancel, fork, put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";

import { backgroundActivityTimeout } from "../../config";
import {
  applicationChangeState,
  ApplicationState
} from "../../store/actions/application";
import { identificationRequest } from "../../store/actions/identification";
import { startTimer } from "../../utils/timer";

/**
 * Listen to APP_STATE_CHANGE_ACTION and if needed force the user to provide
 * the PIN
 */
export function* watchApplicationActivitySaga(): IterableIterator<Effect> {
  const backgroundActivityTimeoutMillis = backgroundActivityTimeout * 1000;

  // tslint:disable-next-line:no-let
  let lastState: ApplicationState = "active";
  // tslint:disable-next-line:no-let
  let identificationBackgroundTimer: Task | undefined;

  yield takeEvery(getType(applicationChangeState), function*(
    action: ActionType<typeof applicationChangeState>
  ) {
    // Listen for changes in application state
    const newApplicationState: ApplicationState = action.payload;

    if (lastState !== "background" && newApplicationState === "background") {
      // Start the background timer
      identificationBackgroundTimer = yield fork(
        startIdentificationBackgroundTimer,
        backgroundActivityTimeoutMillis
      );
    } else if (lastState === "background" && newApplicationState === "active") {
      // Cancel the background timer if running
      if (identificationBackgroundTimer) {
        yield cancel(identificationBackgroundTimer);
        identificationBackgroundTimer = undefined;
      }
    }

    // Update the last state
    lastState = newApplicationState;
  });

  function* startIdentificationBackgroundTimer(
    delay: number
  ): IterableIterator<Effect> {
    yield call(startTimer, delay);
    yield put(identificationRequest());
  }
}
