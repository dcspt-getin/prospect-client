/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isFunction from "lodash/isFunction";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import AutoComplete from "react-google-autocomplete";
import styled from "styled-components";

export default compose(
  withProps(({ apiKey }) => ({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  })),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        center:
          this.props.value && this.props.value.center
            ? this.props.value.center
            : {
                lat: 40.624171241000056,
                lng: -8.638276056999928,
              },
        refs,
        markers:
          this.props.value && this.props.value.markers
            ? this.props.value.markers.map((m) => ({
                position: m,
              }))
            : [
                {
                  position: {
                    lat: 40.624171241000056,
                    lng: -8.638276056999928,
                  },
                },
              ],
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          // this.setState({
          //   bounds: refs.map.getBounds(),
          //   center: refs.map.getCenter(),
          // });
        },
        onSearchBoxMounted: (ref) => {
          refs.searchBox = ref;
        },
        onPlacesChanged: (place) => {
          const bounds = new window.google.maps.LatLngBounds();

          if (!place.geometry) return;

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
          const nextMarker = {
            position: place.geometry.location,
          };
          const nextCenter = get([nextMarker], "0.position", this.state.center);

          this.setState({
            center: nextCenter,
            markers: [nextMarker],
          });
          // refs.map.fitBounds(bounds);
        },
        onMarkerDragEnd: (index) => (coord) => {
          const { latLng } = coord;
          const lat = latLng.lat();
          const lng = latLng.lng();
          this.setState((prevState) => {
            const markers = [...this.state.markers];
            markers[index] = {
              position: { lat, lng },
            };
            return { markers };
          });
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const [location, setLocation] = React.useState(
    props.value && props.value.location
  );

  React.useEffect(() => {
    if (!props.onChange) return;

    props.onChange({
      location,
      markers: props.markers.map((m) => ({
        lat: isFunction(m.position.lat) ? m.position.lat() : m.position.lat,
        lng: isFunction(m.position.lng) ? m.position.lng() : m.position.lng,
      })),
      center: {
        lat: isFunction(props.center.lat)
          ? props.center.lat()
          : props.center.lat,
        lng: isFunction(props.center.lng)
          ? props.center.lng()
          : props.center.lng,
      },
    });
  }, [location, props.markers, props.center]);

  React.useEffect(() => {
    setLocation(props.value && props.value.location);
  }, [props.value]);

  const _onPlacesChanged = (place) => {
    setLocation(place.formatted_address);
    props.onPlacesChanged(place);
  };

  return (
    <>
      <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={10}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
      >
        {props.markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            draggable={true}
            onDragEnd={props.onMarkerDragEnd(index)}
          />
        ))}
      </GoogleMap>
      <AutocompleDiv>
        <AutoComplete
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          apiKey={props.apiKey}
          onPlaceSelected={_onPlacesChanged}
          placeholder="Your location"
          options={{
            types: ["geocode"],
          }}
        />
      </AutocompleDiv>
    </>
  );
});

const AutocompleDiv = styled.div`
  margin-top: 12px;

  input {
    width: 100%;
    padding: 10px;
    border: 2px solid #333;
  }
`;
