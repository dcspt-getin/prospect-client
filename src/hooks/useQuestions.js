import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "src/store/questions/actions";
import { getQuestions } from "store/questions/selectors";

/* eslint-disable import/no-anonymous-default-export */
export default () => {
  const dispatch = useDispatch();
  const questions = useSelector(getQuestions);

  React.useEffect(() => {
    dispatch(fetchQuestions());
  }, []);

  return [questions];
};
