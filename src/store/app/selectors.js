import { createSelector } from "reselect";

const getState = (state) => state.app;

export const makeGetAppConfiguration = () => {
  return createSelector(
    getState,
    (_, configKey) => configKey,
    (state, configKey) => {
      return (
        state.configurations[configKey] && state.configurations[configKey].value
      );
    }
  );
};

export const getAppConfiguration = makeGetAppConfiguration();

export const makeGetTranslationsGroup = () => {
  return createSelector(
    getState,
    (_, group) => group,
    (state, group) => {
      const { currentTranslation, translations } = state;

      const curentTranslationEntity = translations.find(
        (t) => t.language_code === currentTranslation
      );

      return curentTranslationEntity
        ? curentTranslationEntity.translations[group] || {}
        : {};
    }
  );
};

export const getTranslationsGroup = makeGetTranslationsGroup();
