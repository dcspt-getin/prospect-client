import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import usePollingEffect from "hooks/usePollingEffect";
import { getUserProfileQuestionInfo } from "store/profiles/actions";
import { getActiveProfile } from "store/profiles/selectors";

const Embedded = ({ question }) => {
  const dispatch = useDispatch();
  const activeProfile = useSelector(getActiveProfile);

  const { embedded_question_url, id, embedded_size: embeddedSize } = question;

  const refereshQuestionData = () =>
    dispatch(getUserProfileQuestionInfo(activeProfile?.id, id));

  usePollingEffect(
    async () => {
      refereshQuestionData();
    },
    [],
    { interval: 20000 }
  );

  useEffect(() => {
    const handleMessageReceived = function (event) {
      const iframe = document.getElementById("embedded-iframe");

      // Make sure the message is from the correct iframe (optional)
      if (event.source === iframe.contentWindow) {
        // Log the received message
        if (event.data === "questionChanged") {
          refereshQuestionData();
        }
      }
    };

    // Listen for messages from the iframe
    window.addEventListener("message", handleMessageReceived);

    return () => {
      window.removeEventListener("message", handleMessageReceived);
    };
  }, []);

  if (!embedded_question_url) {
    return "Embeded url is required";
  }

  const token = localStorage.getItem("jwtToken");
  const { width, height } = embeddedSize || {};

  const iframeWidth = width || "100%";
  const iframHeight = height || "100%";
  const iframeUrl = `${embedded_question_url}?token=${token}&profileId=${activeProfile?.id}&question=${id}&embedded=true&width=${width}&height=${height}`;

  return (
    <iframe
      id="embedded-iframe"
      src={iframeUrl}
      width={iframeWidth}
      height={iframHeight}
    />
  );
};

export default Embedded;
