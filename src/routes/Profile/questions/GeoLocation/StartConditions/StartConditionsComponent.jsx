/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { getAppConfiguration } from "store/app/selectors";

import UserLocationMap from "./UserLocationMap";
import QuestionInfo from "../../_shared/QuestionInfo";

export default ({ question, value, parentValue, onChange, disabled }) => {
  const questionRef = React.useRef(question);
  const [rerender, setRerender] = React.useState(false);

  questionRef.current = question;

  const profile = value || {};
  const updateProfileData = (data) =>
    onChange({ ...profile, ...data }, questionRef.current, {}, false);

  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );

  React.useEffect(() => {
    setRerender(true);

    setTimeout(() => {
      setRerender(false);
    }, 100);
  }, [question]);

  if (rerender) return "";

  return (
    <Wrapper>
      <QuestionInfo parentValue={parentValue} question={question} />
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div style={{ height: 450 }}>
              <UserLocationMap
                apiKey={googleMapsApiKey}
                value={profile && profile.userLocation}
                onChange={(data) => updateProfileData({ userLocation: data })}
                disabled={disabled}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
