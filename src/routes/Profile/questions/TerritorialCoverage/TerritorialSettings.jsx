/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { List, Segment, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { getAppConfiguration } from "store/app/selectors";
import { fetchTerritorialCoverages } from "store/urbanShapes/actions";
import TerritorialMap from "./TerritorialMap";
import QuestionInfo from "../_shared/QuestionInfo";

export default ({ question, value, onChange, disabled }) => {
  const [geoJson, setGeoJson] = React.useState();
  const [regions, setRegions] = React.useState();
  const [selectedRegion, _setSelectedRegion] = React.useState();
  const dispatch = useDispatch();
  const territorialCoverages = useSelector(
    (state) => state.urbanShapes.territorialCoverages
  );
  const questionRef = React.useRef(question);

  questionRef.current = question;

  const profile = value || {};
  const updateProfileData = (data) =>
    onChange(data, questionRef.current, {}, false);

  const setSelectedRegion = (region) => {
    if (!region) return;
    _setSelectedRegion(region);
    updateProfileData({ selectedTC: region.id });
  };

  const defaultSelectedRegion = useSelector((state) =>
    getAppConfiguration(state, "DEFAULT_SELECTED_TERRITORIAL_COVERAGE_ID")
  );
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );
  const currentUser = useSelector((state) => state.auth.currentUser);

  React.useEffect(() => {
    const userGroup = currentUser.groups.length && currentUser.groups[0];
    if (profile && profile.selectedTC && regions) {
      setTimeout(
        () =>
          _setSelectedRegion(regions.find((r) => r.id === profile.selectedTC)),
        500
      );
      return;
    }
    if (!defaultSelectedRegion || !userGroup || !regions) return;

    const parsedDefaultSelectedRegion = JSON.parse(defaultSelectedRegion);

    if (userGroup && parsedDefaultSelectedRegion[userGroup.name]) {
      const defaultSelectedRegionId =
        parsedDefaultSelectedRegion[userGroup.name];
      setTimeout(
        () =>
          setSelectedRegion(
            regions.find((r) => r.id === defaultSelectedRegionId)
          ),
        500
      );
    }
  }, [regions, !profile]);

  React.useEffect(() => {
    dispatch(fetchTerritorialCoverages());
  }, []);
  React.useEffect(() => {
    if (!territorialCoverages.length) return;

    const colors = territorialCoverages.reduce((acc, entry) => {
      acc[entry.municod] = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      return acc;
    }, {});
    const allRegions = territorialCoverages
      .map((entry) =>
        entry.units.map((u) => ({
          ...u,
          geometry: { ...u.geometry, color: colors[entry.municod] },
          municod: entry.municod,
        }))
      )
      .flat();
    const data = allRegions.map((r) => ({
      ...r.geometry,
      municod: r.municod,
    }));

    setGeoJson(data);
    setRegions(
      territorialCoverages.map((r) => ({
        id: r.id,
        name: r.name,
        municod: r.municod,
      }))
    );
  }, [territorialCoverages]);

  const visibleItems = selectedRegion
    ? geoJson.filter((o) => o.municod === selectedRegion.municod)
    : [];

  const _renderMap = () => (
    <MapDiv>
      {geoJson && (
        <TerritorialMap
          apiKey={googleMapsApiKey}
          geoJson={geoJson}
          visibleItems={visibleItems}
          center={{ lat: 40.624171241000056, lng: -8.638276056999928 }}
        />
      )}
    </MapDiv>
  );
  const _renderTerritorialSelector = () => (
    <ListDiv>
      <Segment>
        <List selection verticalAlign="middle">
          {regions &&
            regions.map((region) => (
              <List.Item
                active={selectedRegion && selectedRegion.id === region.id}
                onClick={() => setSelectedRegion(region)}
              >
                <List.Content>
                  <List.Header>{region.name}</List.Header>
                </List.Content>
              </List.Item>
            ))}
        </List>
      </Segment>
    </ListDiv>
  );

  return (
    <>
      <QuestionInfo question={question} />
      <PageContent>
        <Grid>
          <Grid.Column only="tablet computer" tablet={8} computer={10}>
            {_renderMap()}
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={6}>
            {_renderTerritorialSelector()}
          </Grid.Column>
          <Grid.Column mobile={16} only="mobile">
            {_renderMap()}
          </Grid.Column>
        </Grid>
      </PageContent>
    </>
  );
};

const PageContent = styled.div``;

const MapDiv = styled.div``;

const ListDiv = styled.div``;
