const getQuestionStartTime = (meta) => {
  const shouldSaveStartTime = !meta?.startTime || !!meta?.endTime;

  if (!shouldSaveStartTime) return;
  if (meta?.isValid) return {};

  return { startTime: new Date().getTime() };
};

const getQuestionEndTime = (meta) => {
  const shuldSaveEndTime =
    !meta?.endTime || (meta?.startTime && meta.startTime > meta.endTime);

  if (!shuldSaveEndTime) return {};
  if (meta?.isValid) return {};

  return {
    endTime: shuldSaveEndTime ? new Date().getTime() : meta.endTime,
  };
};

export { getQuestionStartTime, getQuestionEndTime };
