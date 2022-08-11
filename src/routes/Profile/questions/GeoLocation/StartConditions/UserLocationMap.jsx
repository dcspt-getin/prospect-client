/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import { Button } from "semantic-ui-react";
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
    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.state.value?.center, nextProps.value?.center)) {
        this.setState({
          center: nextProps.value.center,
        });
      }
      if (!isEqual(this.state.value?.markers, nextProps.value?.markers)) {
        this.setState({
          markers: nextProps.value.markers.map((m) => ({
            position: m,
          })),
        });
      }
    },
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

  const askUserForLocation = () => {
    const geolocation = navigator.geolocation;
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const _onGeoSuccess = (position) => {
      const { latitude, longitude } = position.coords;

      // const latitude = 40.6367517;
      // const longitude = -8.197332;
      const point = {
        lat: latitude,
        lng: longitude,
      };
      setLocation("");
      props.onChange({
        location: "",
        markers: [point],
        center: point,
      });
    };

    const _onGeoError = (error) => {
      let detailError;

      if (error.code === error.PERMISSION_DENIED) {
        detailError = "User denied the request for Geolocation.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        detailError = "Location information is unavailable.";
      } else if (error.code === error.TIMEOUT) {
        detailError = "The request to get user location timed out.";
      } else if (error.code === error.UNKNOWN_ERROR) {
        detailError = "An unknown error occurred.";
      }

      alert(`Error: ${detailError}`);
    };

    if (geolocation) {
      geolocation.getCurrentPosition(_onGeoSuccess, _onGeoError, options);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  React.useEffect(() => {
    setLocation(props.value?.location);
  }, [props.value?.location]);

  const _onPlacesChanged = (place) => {
    setLocation(place.formatted_address);
    const point = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    props.onChange({
      location,
      markers: [point],
      center: point,
    });
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
        <Button
          size="large"
          icon="map marker alternate"
          onClick={askUserForLocation}
        />
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
  display: flex;

  input {
    width: 100%;
    padding: 10px;
    border: 2px solid #333;
    margin-left: 10px;
  }
`;
