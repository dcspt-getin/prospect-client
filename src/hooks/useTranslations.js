/* eslint-disable import/no-anonymous-default-export */
import { useSelector } from "react-redux";
import { getTranslationsGroup } from "store/app/selectors";

export default (group) => {
  const translations = useSelector((state) =>
    getTranslationsGroup(state, group)
  );

  const _translate = (key) => {
    if (!translations[key]) return key;

    return translations[key];
  };

  return [_translate, translations];
};
