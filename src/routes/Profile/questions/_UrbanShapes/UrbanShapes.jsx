/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";

import QuestionInfo from "../_shared/QuestionInfo";
import StartConditions from "./StartConditions";
import TerritorialSettings from "./TerritorialSettings";
import Comparisions from "./Comparisions";
import Calibrations from "./Calibrations";
import UrbanShapesResults from "./UrbanShapesResults";

const START_CONDITIONS = "START_CONDITIONS";
const TERRITORIAL_SETTINGS = "TERRITORIAL_SETTINGS";
const COMPARISIONS = "COMPARISIONS";
const CALIBRATIONS = "CALIBRATIONS";
const RESULTS = "RESULTS";

const stepsMapper = {
  [START_CONDITIONS]: StartConditions,
  [TERRITORIAL_SETTINGS]: TerritorialSettings,
  [COMPARISIONS]: Comparisions,
  [CALIBRATIONS]: Calibrations,
  [RESULTS]: UrbanShapesResults,
};

const UrbanShapesComponent = ({ question, parentValue }) => {
  const [currentStep, setCurrentStep] = React.useState(TERRITORIAL_SETTINGS);

  const Component = stepsMapper[currentStep];

  return (
    <Wrapper>
      <QuestionInfo parentValue={parentValue} question={question} />
      <Component />
    </Wrapper>
  );
};

export default UrbanShapesComponent;

const Wrapper = styled.div``;
