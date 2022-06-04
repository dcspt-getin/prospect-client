/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Step } from "semantic-ui-react";

import useTranslations from "hooks/useTranslations";
import { Media } from "app/Media";

export default ({ activeIndex }) => {
  const [t] = useTranslations("urbanShapes");

  return (
    <Media greaterThan="tablet">
      <Step.Group size="mini">
        <Step active={activeIndex === 0}>
          <Step.Content>
            <Step.Title>{t("BREADCRUMB_URBAN_SYSTEM")}</Step.Title>
          </Step.Content>
        </Step>

        <Step active={activeIndex === 1}>
          <Step.Content>
            <Step.Title>{t("BREADCRUMB_GEOLOCALIZATION")}</Step.Title>
          </Step.Content>
        </Step>

        <Step active={activeIndex === 2}>
          <Step.Content>
            <Step.Title>{t("BREADCRUMB_COMPARISIONS")}</Step.Title>
          </Step.Content>
        </Step>
        <Step active={activeIndex === 3}>
          <Step.Content>
            <Step.Title>{t("BREADCRUMB_CALIBRATIONS")}</Step.Title>
          </Step.Content>
        </Step>
        <Step active={activeIndex === 4}>
          <Step.Content>
            <Step.Title>{t("BREADCRUMB_RESULTS")}</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    </Media>
  );
};
