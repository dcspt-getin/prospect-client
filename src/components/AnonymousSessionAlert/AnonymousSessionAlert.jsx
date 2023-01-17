import React, { useState } from "react";
import { Modal } from "semantic-ui-react";

import useAnonymousSessionTime from "hooks/useAnonymousSessionTime";

const AnonymousSessionAlert = () => {
  const [sessionEndAlert, setSessionEndAlert] = useState(false);
  const [closedSessionAlert, setClosedSessionAlert] = useState(false);

  const showSessionAlert = () => {
    if (sessionEndAlert) return;

    setSessionEndAlert(true);
  };
  const closeUserSession = () => {
    if (closedSessionAlert) return;

    setClosedSessionAlert(true);
  };

  const { closeAlert: closeAlertOnHook, timeLeft } = useAnonymousSessionTime(
    showSessionAlert,
    closeUserSession
  );

  if (sessionEndAlert) {
    const onClose = () => {
      setSessionEndAlert(false);
      closeAlertOnHook();
    };

    return (
      <Modal
        open
        onClose={onClose}
        header="Session timeout!"
        content={`Your session will be closed in ${timeLeft} minute(s).`}
        actions={[
          {
            key: "done",
            content: "Close",
            positive: true,
            onClick: onClose,
          },
        ]}
      />
    );
  }

  if (closedSessionAlert) {
    return (
      <Modal
        open
        header="Session closed!"
        content={`Your session is ended. You will be logged out.`}
      />
    );
  }

  return "";
};

export default AnonymousSessionAlert;
