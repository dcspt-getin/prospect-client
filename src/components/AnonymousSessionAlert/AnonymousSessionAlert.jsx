import React, { useState } from "react";
import { Modal } from "semantic-ui-react";

import useAnonymousSessionTime from "hooks/useAnonymousSessionTime";
import useTranslations from "hooks/useTranslations";

const AnonymousSessionAlert = () => {
  const [t] = useTranslations("sessionTimeoutAlert");

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
        header={t("Session timeout!")}
        content={`${t("Your session will be closed in")} ${timeLeft} ${t(
          "minute(s)."
        )}`}
        actions={[
          {
            key: "done",
            content: t("Close"),
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
        header={t("Session closed!")}
        content={t(`Your session is ended. You will be logged out.`)}
      />
    );
  }

  return "";
};

export default AnonymousSessionAlert;
