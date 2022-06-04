/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, List, Segment, Icon, Grid } from "semantic-ui-react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
} from "react-google-maps";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { getAppConfiguration } from "store/app/selectors";
import { fetchTerritorialCoverages } from "store/urbanShapes/actions";
import UrbanShapesSteps from "components/UrbanShapesSteps";
import useTranslations from "hooks/useTranslations";
import InfoModal from "components/InfoModal";
import HTMLContent from "components/HTMLContent";
import InllineHelpTextDiv from "components/InllineHelpTextDiv";

const MyMapComponent = compose(
  withProps(({ apiKey }) => ({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  })),
  withScriptjs,
  withGoogleMap
)((props) => {
  const [polygons, setPolygons] = React.useState([]);
  const mapRef = React.useRef();

  React.useEffect(() => {
    const data = props.geoJson.reduce((acc, region) => {
      let coordinates = region.geometry.coordinates.flat();
      const _parseRegion = (id, coord) => ({
        id: id,
        path: coord,
        options: {
          fillColor: "#b90a0a",
          fillOpacity: 0.4,
          strokeColor: "#b90a0a",
          strokeOpacity: 1,
          strokeWeight: 1,
        },
      });

      const _mapToCoord = (coordinate) => {
        if (coordinate.length > 2) {
          return coordinate.map(_mapToCoord);
        }

        return {
          lat: coordinate[1],
          lng: coordinate[0],
        };
      };
      const coordArr = coordinates.map(_mapToCoord);

      if (coordArr[0].length > 2) {
        return [
          ...acc,
          ...coordArr.reduce((acc1, cur) => {
            return [...acc1, _parseRegion(region.id, cur)];
          }, []),
        ];
      }

      return [...acc, _parseRegion(region.id, coordArr)];
    }, []);

    setPolygons(data);
  }, []);

  return (
    <GoogleMap ref={mapRef} defaultZoom={10} defaultCenter={props.center}>
      {polygons.map((polygon) => (
        <Polygon
          {...polygon}
          visible={props.visibleItems.some((p) => p.id === polygon.id)}
        />
      ))}
    </GoogleMap>
  );
});

export default () => {
  const [t] = useTranslations("urbanShapes");
  const [showHelpText, setShowHelpText] = React.useState(false);
  const [geoJson, setGeoJson] = React.useState();
  const [regions, setRegions] = React.useState();
  const [selectedRegion, _setSelectedRegion] = React.useState();
  const dispatch = useDispatch();
  const territorialCoverages = useSelector(
    (state) => state.urbanShapes.territorialCoverages
  );

  const profile = {};
  const updateProfileData = () => {};

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
        <MyMapComponent
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
      <UrbanShapesSteps activeIndex={0} />
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("CHOOSE_TERRITOTIAL_SYSTEM_TITLE")}
          <InllineHelpTextDiv>
            <InfoModal
              open={showHelpText}
              onOpen={() => setShowHelpText(true)}
              onClose={() => setShowHelpText(false)}
              content={<HTMLContent html={t("HELP_TEXT_1")} />}
              trigger={<Icon circular name="info" />}
            />
          </InllineHelpTextDiv>
        </Header>
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
      </div>
    </>
  );
};

const PageContent = styled.div``;

const MapDiv = styled.div``;

const ListDiv = styled.div``;
