/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import get from "lodash/get";
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
        onPlacesChanged: (place, markerIndex) => {
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
          const newMarkers = [
            ...this.state.markers.filter((m, i) => i !== markerIndex),
          ];
          newMarkers.splice(markerIndex, 0, nextMarker);

          this.setState({
            center: nextCenter,
            markers: newMarkers,
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
  const [location1, setLocation1] = React.useState(
    props.value && props.value.location1
  );
  const [location2, setLocation2] = React.useState(
    props.value && props.value.location2
  );

  React.useEffect(() => {
    if (!props.onChange) return;

    props.onChange({
      location1,
      location2,
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
  }, [location1, location2, props.markers, props.center]);

  const _onPlacesChanged = (markerIndex) => (place) => {
    if (markerIndex === 0) setLocation1(place.formatted_address);
    if (markerIndex === 1) setLocation2(place.formatted_address);
    props.onPlacesChanged(place, markerIndex);
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
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
          apiKey={props.apiKey}
          onPlaceSelected={_onPlacesChanged(0)}
          placeholder="Your"
          options={{
            types: ["geocode"],
          }}
        />
      </AutocompleDiv>
      {props.showPartnerWorkplaceMap && (
        <AutocompleDiv>
          <AutoComplete
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            apiKey={props.apiKey}
            onPlaceSelected={_onPlacesChanged(1)}
            placeholder="Your partner"
            options={{
              types: ["geocode"],
            }}
          />
        </AutocompleDiv>
      )}
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
