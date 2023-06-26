import React from "react";
import { useDispatch, useSelector } from "react-redux";

import usePollingEffect from "hooks/usePollingEffect";
import { getUserProfileQuestionInfo } from "store/profiles/actions";
import { getActiveProfile } from "store/profiles/selectors";

const Embedded = ({ question }) => {
  const dispatch = useDispatch();
  const activeProfile = useSelector(getActiveProfile);

  const { embedded_question_url, id, embedded_size: embeddedSize } = question;

  usePollingEffect(
    async () => {
      dispatch(getUserProfileQuestionInfo(activeProfile?.id, id));
    },
    [],
    { interval: 10000 }
  );

  if (!embedded_question_url) {
    return "Embeded url is required";
  }

  const token = localStorage.getItem("jwtToken");
  const { width, height } = embeddedSize || {};

  const iframeWidth = width || "100%";
  const iframHeight = height || "100%";

  return (
    <iframe
      src={`${embedded_question_url}?embedded=true&width=${width}&height=${height}&question=${id}&token=${token}`}
      width={iframeWidth}
      height={iframHeight}
    />
  );
};

export default Embedded;
