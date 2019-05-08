import { none, Option, some } from "fp-ts/lib/Option";
import { readableReport } from "italia-ts-commons/lib/reporters";
import { Effect } from "redux-saga";
import { call, put } from "redux-saga/effects";
import { isLeft } from "fp-ts/lib/Either";

import { PublicSession } from "../../../definitions/backend/PublicSession";

import {
  sessionInformationLoadFailure,
  sessionInformationLoadSuccess
} from "../../store/actions/authentication";

import { SagaCallReturnType } from "../../types/utils";

import { BackendClient } from "../../api/backend";

/**
 * Load session info from the Backend
 *
 * FIXME: this logic is common to all sagas that make requests to the backend,
 *        we should create a high order function that converts an API call into
 *        a saga.
 */
export function* loadSessionInformationSaga(
  getSession: ReturnType<typeof BackendClient>["getSession"]
): IterableIterator<Effect | Option<PublicSession>> {
  // Call the Backend service
  const response: SagaCallReturnType<typeof getSession> = yield call(
    getSession,
    {}
  );

  if (isLeft(response)) {
    // decoding error
    yield put(sessionInformationLoadFailure(readableReport(response.value)));
  }

  if (response.value.status === 200) {
    // Ok we got a valid response, send a SESSION_LOAD_SUCCESS action
    yield put(sessionInformationLoadSuccess(response.value));
    return some(response.value);
  }

  // We got a error, send a SESSION_LOAD_FAILURE action
  const error: Error =
    response && response.status === 400
      ? Error(response.value.title)
      : Error("Invalid server response");
  yield put(sessionInformationLoadFailure(error));
  return none;
}
