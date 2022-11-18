import React from "react";
import styled from "styled-components";
import { Pannellum } from "pannellum-react";

import GoogleStreetView from "components/GoogleStreetView";

const TerritorialUnitImage = ({
  image,
  useGoogleStreetImages,
  use360Image,
  googleMapsApiKey,
}) => {
  if (!image) return "image not available";

  if (useGoogleStreetImages) {
    return (
      <GoogleStreetView
        apiKey={googleMapsApiKey}
        streetViewPanoramaOptions={{
          position: image.geometry,
        }}
      />
    );
  }

  if (use360Image) {
    return (
      <ImageContainer>
        <Pannellum
          width="100%"
          height="300px"
          image={image.image || image.image_url}
          pitch={10}
          yaw={180}
          hfov={110}
          autoLoad
          // onLoad={() => {
          //   console.log("panorama loaded");
          // }}
        />
      </ImageContainer>
    );
  }

  return (
    <ImageContainer
      style={{ backgroundImage: `url(${image.image || image.image_url})` }}
    />
  );
};

export default TerritorialUnitImage;

const ImageContainer = styled.div`
  background-size: contain;
`;
