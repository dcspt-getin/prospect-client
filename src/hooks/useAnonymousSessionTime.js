import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState, useRef } from "react";
import moment from "moment";
import Cookies from "js-cookie";

import configurations from "helpers/configurations";
import { getAppConfiguration } from "store/app/selectors";
import { logOutUser } from "store/auth/actions";

const useAnonymousSessionTime = (showSessionAlert, closeUserSession) => {
  const dispatch = useDispatch();
  const [closedAlert, setClosedAlert] = useState(false);
  const currentUser = useSelector((state) => state && state.auth.currentUser);
  const anonymousSessionMaxTime = useSelector((state) =>
    getAppConfiguration(state, configurations.ANONYMOUS_SESSION_MAX_TIME)
  );
  const anonymousSessionShowAlertTime = useSelector((state) =>
    getAppConfiguration(state, configurations.ANONYMOUS_SESSION_SHOW_ALERT_TIME)
  );
  const prolificCompletionUrl = useSelector((state) =>
    getAppConfiguration(state, configurations.PROLIFIC_COMPLETION_URL)
  );
  const isAnonymousUser = useMemo(() => !currentUser?.email, [currentUser]);
  const closedAlertRef = useRef(closedAlert);

  closedAlertRef.current = closedAlert;

  const _closeSession = () => {
    dispatch(logOutUser());

    if (Cookies.get("prolificPid") && prolificCompletionUrl) {
      window.location = prolificCompletionUrl;
    } else {
      window.location.reload();
    }
  };

  const checkUserSessionTime = () => {
    // only for anonymous sessions
    if (!currentUser || !isAnonymousUser) {
      return;
    }

    // if now setted any value does not do anything
    if (!anonymousSessionMaxTime) {
      return;
    }

    const lastLoginDate = moment(currentUser?.last_login);

    const limitSessionTime = moment(lastLoginDate).add(
      parseInt(anonymousSessionMaxTime),
      "seconds"
    );

    // Close Session
    if (moment() > limitSessionTime) {
      if (closeUserSession) closeUserSession();

      setTimeout(() => {
        _closeSession();
      }, 6000);

      return;
    }

    // if now setted any value does not do anything
    if (!anonymousSessionShowAlertTime) {
      return;
    }

    const limitTimeToShowAlert = moment(lastLoginDate).add(
      parseInt(anonymousSessionShowAlertTime),
      "seconds"
    );

    // show session will end alert
    if (moment() > limitTimeToShowAlert && !closedAlertRef.current) {
      if (showSessionAlert) showSessionAlert();
    }
  };

  // every 10 seconds will check session timeout
  setInterval(checkUserSessionTime, 10000);

  const timeLeft = useMemo(() => {
    if (!currentUser) {
      return 0;
    }

    if (!anonymousSessionMaxTime) {
      return 0;
    }

    const limitSessionTime = moment(currentUser.last_login).add(
      parseInt(anonymousSessionMaxTime),
      "seconds"
    );

    const duration = moment.duration(limitSessionTime.diff(new Date()));

    return parseInt(duration.asMinutes());
  }, [anonymousSessionShowAlertTime, currentUser]);

  return {
    closeAlert: () => setClosedAlert(true),
    timeLeft,
  };
};

export default useAnonymousSessionTime;
