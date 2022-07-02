/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Header, Image, Icon } from "semantic-ui-react";
import styled from "styled-components";
import { compose, withProps } from "recompose";
import { useSelector } from "react-redux";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
  Marker,
  InfoWindow,
} from "react-google-maps";
import { Redirect } from "react-router-dom";

import { getAppConfiguration } from "store/app/selectors";
import useTranslations from "hooks/useTranslations";
import InfoModal from "components/InfoModal";
import HTMLContent from "components/HTMLContent";
import InllineHelpTextDiv from "components/InllineHelpTextDiv";

import { colorGradient } from "./helpers";
import UrbanShapesSteps from "components/UrbanShapesSteps";

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

  React.useEffect(() => {
    const data = props.geoJson.reduce((acc, region) => {
      let coordinates = region.geometry.geometry.coordinates.flat();
      const _parseRegion = (r, coord) => ({
        id: r.id,
        path: coord,
        options: {
          fillColor: r.geometry.color,
          fillOpacity: 0.4,
          strokeColor: r.geometry.color,
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
            return [...acc1, _parseRegion(region, cur)];
          }, []),
        ];
      }

      return [...acc, _parseRegion(region, coordArr)];
    }, []);

    setPolygons(data);
  }, []);

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 40.624171241000056, lng: -8.638276056999928 }}
    >
      {polygons.map((polygon) => (
        <Polygon {...polygon} />
      ))}
      {props.markers &&
        props.markers.map((marker, index) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={marker.onClick}
          >
            {marker.id === props.activeMarker ? (
              <InfoWindow {...marker.infoWindow}>
                <Image
                  src={marker.image}
                  fluid
                  style={{ width: 200, height: 200 }}
                />
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
    </GoogleMap>
  );
});

export default () => {
  const [t] = useTranslations("urbanShapes");
  const [activeMarker, setActiveMarker] = React.useState();
  const [markers, setMarkers] = React.useState();
  const [geoJson, setGeoJson] = React.useState();
  const [showHelpText, setShowHelpText] = React.useState();
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );
  const profile = {};
  const { comparisionsModel, imagesSet } = profile;
  const territorialCoverages = useSelector(
    (state) => state.urbanShapes.territorialCoverages
  );

  const _handleMarkerClick = (id) => () => {
    setActiveMarker(id);
  };
  const _handleCloseMarker = () => setActiveMarker(null);

  React.useEffect(() => {
    if (!imagesSet) return;
    const _load = async () => {
      const { intermediateOrder } = comparisionsModel;
      const selectedTC = territorialCoverages.find(
        (tc) => tc.id === profile.selectedTC
      );
      const allUnits = selectedTC ? selectedTC.units : [];

      const newMarkers = [];
      const colors = allUnits.reduce((acc, entry) => {
        const image = imagesSet.find((i) => Object.keys(i)[0] === entry.tucode);
        if (!image) return acc;

        const imageCoords = Object.values(image)[0];
        newMarkers.push({
          position: imageCoords,
          id: entry.id,
          onClick: _handleMarkerClick(entry.id),
          image: `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${`${imageCoords.lat},${imageCoords.lng}`}&fov=100&heading=100&pitch=0&key=${googleMapsApiKey}`,
          infoWindow: {
            onCloseClick: _handleCloseMarker,
          },
        });
        const imageIndex = intermediateOrder.findIndex(
          (o) => Object.keys(image)[0] === o
        );

        acc[entry.id] = colorGradient(imageIndex / 10);
        return acc;
      }, {});
      const data = allUnits.map((entry) => ({
        geometry: { ...entry.geometry, color: colors[entry.id] },
      }));

      setMarkers(newMarkers);
      setGeoJson(data);
    };

    _load();
  }, []);

  // if (!profile || !comparisionsModel)
  //   return <Redirect to="/territorial-settings" />;

  if (!comparisionsModel?.completed) {
    return (
      <>
        <UrbanShapesSteps activeIndex={4} />
        <div className="p-4">{t("PLEASE_COMPLETE_COMPARISIONS")}</div>
      </>
    );
  }

  return (
    <>
      <UrbanShapesSteps activeIndex={4} />
      <div className="p-4">
        <Header size="huge" as="h1">
          {t("RESULTS_TITLE")}

          <InllineHelpTextDiv>
            <InfoModal
              open={showHelpText === "help2"}
              onOpen={() => setShowHelpText("help2")}
              onClose={() => setShowHelpText(null)}
              content={<HTMLContent html={t("HELP_TEXT_8")} />}
              trigger={<Icon circular name="info" />}
            />
          </InllineHelpTextDiv>
        </Header>
        <PageContent>
          <MapDiv>
            {geoJson && (
              <MyMapComponent
                apiKey={googleMapsApiKey}
                geoJson={geoJson}
                markers={markers}
                activeMarker={activeMarker}
              />
            )}
          </MapDiv>
        </PageContent>
      </div>
    </>
  );
};

const PageContent = styled.div`
  display: flex;
`;

const MapDiv = styled.div`
  width: 100%;
`;
