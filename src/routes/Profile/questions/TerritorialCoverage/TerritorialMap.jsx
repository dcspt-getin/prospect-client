import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
} from "react-google-maps";

const TerritorialMapComponent = compose(
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

export default TerritorialMapComponent;
