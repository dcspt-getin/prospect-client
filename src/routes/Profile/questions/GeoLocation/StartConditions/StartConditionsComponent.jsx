/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Button, Icon, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { getAppConfiguration } from "store/app/selectors";

import UserLocationMap from "./UserLocationMap";
import UserWorkplaceMap from "./UserWorkplaceMap";
import useTranslations from "hooks/useTranslations";
import InfoModal from "components/InfoModal";
import HTMLContent from "components/HTMLContent";
import InllineHelpTextDiv from "components/InllineHelpTextDiv";
import QuestionInfo from "../../_shared/QuestionInfo";

export default ({ question, value, onChange, disabled }) => {
  const [showHelpText, setShowHelpText] = React.useState();

  const [t] = useTranslations("urbanShapes");

  const questionRef = React.useRef(question);

  const profile = value || {};
  const updateProfileData = (data) =>
    onChange({ ...profile, ...data }, questionRef.current, {}, false);

  const setSelectedLiveRank = (rank) => (e) => {
    updateProfileData({ livingSatisfaction: rank });
  };
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );
  // const currentUser = useSelector((state) => state.auth.currentUser);

  const showPartnerWorkplaceMap = true;
  //(currentUser.profile.citizen_profile_data || {}).estadoCivil === 2;

  return (
    <Wrapper>
      <QuestionInfo question={question} />
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Header size="huge" as="h1">
              1.1. {t("WHERE_YOU_LIVE_TODAY")}
              <InllineHelpTextDiv>
                <InfoModal
                  open={showHelpText === "help1"}
                  onOpen={() => setShowHelpText("help1")}
                  onClose={() => setShowHelpText(null)}
                  content={<HTMLContent html={t("HELP_TEXT_2")} />}
                  trigger={<Icon circular name="info" />}
                />
              </InllineHelpTextDiv>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div style={{ height: 450 }}>
              <UserLocationMap
                apiKey={googleMapsApiKey}
                value={profile && profile.userLocation}
                onChange={(data) => updateProfileData({ userLocation: data })}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header size="huge" as="h1">
              1.2. {t("HOW_SATISFIED_YOU_ARE_WHERE_LIVE")}
              <InllineHelpTextDiv>
                <InfoModal
                  open={showHelpText === "help2"}
                  onOpen={() => setShowHelpText("help2")}
                  onClose={() => setShowHelpText(null)}
                  content={<HTMLContent html={t("HELP_TEXT_3")} />}
                  trigger={<Icon circular name="info" />}
                />
              </InllineHelpTextDiv>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div style={{ display: "flex" }}>
              <ButtonGroupLabel>{t("LOW")}</ButtonGroupLabel>
              <ButtonGroup basic size="small">
                <Button
                  active={profile && profile.livingSatisfaction === 1}
                  onClick={setSelectedLiveRank(1)}
                >
                  1
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 2}
                  onClick={setSelectedLiveRank(2)}
                >
                  2
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 3}
                  onClick={setSelectedLiveRank(3)}
                >
                  3
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 4}
                  onClick={setSelectedLiveRank(4)}
                >
                  4
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 5}
                  onClick={setSelectedLiveRank(5)}
                >
                  5
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 6}
                  onClick={setSelectedLiveRank(6)}
                >
                  6
                </Button>
                <Button
                  active={profile && profile.livingSatisfaction === 7}
                  onClick={setSelectedLiveRank(7)}
                >
                  7
                </Button>
              </ButtonGroup>
              <ButtonGroupLabel>{t("HIGH")}</ButtonGroupLabel>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header size="huge" as="h1">
              1.3. {t("WHERE_IS_YOUR_WORKPLACE")}{" "}
              {showPartnerWorkplaceMap && t("WHERE_IS_YOUR_PARTNER_WORKPLACE")}?
              <InllineHelpTextDiv>
                <InfoModal
                  open={showHelpText === "help3"}
                  onOpen={() => setShowHelpText("help3")}
                  onClose={() => setShowHelpText(null)}
                  content={<HTMLContent html={t("HELP_TEXT_4")} />}
                  trigger={<Icon circular name="info" />}
                />
              </InllineHelpTextDiv>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div style={{ height: 450, marginBottom: 100 }}>
              <UserWorkplaceMap
                apiKey={googleMapsApiKey}
                value={profile && profile.workplaceLocation}
                onChange={(data) =>
                  updateProfileData({ workplaceLocation: data })
                }
                showPartnerWorkplaceMap={showPartnerWorkplaceMap}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const ButtonGroupLabel = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const ButtonGroup = styled(Button.Group)`
  &&&& {
    .ui.button {
      @media only screen and (max-width: 768px) {
        min-width: 36px;
        padding: 10px 0;
      }
      @media only screen and (max-width: 460px) {
        min-width: 26px;
        padding: 10px 0;
      }
    }
  }
`;
