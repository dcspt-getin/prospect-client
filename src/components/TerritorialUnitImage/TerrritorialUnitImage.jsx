import React from "react";
import styled from "styled-components";
import { Pannellum } from "pannellum-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
    // <ImageContainer
    //   style={{ backgroundImage: `url(${image.image || image.image_url})` }}
    // />
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <Tools>
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
          </Tools>
          <TransformComponent>
            <img src={image.image || image.image_url} alt="test" />
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};

export default TerritorialUnitImage;

const ImageContainer = styled.div`
  background-size: contain;
`;

const Tools = styled.div`
  z-index: 1000;
  display: block;
  height: 20px !important;
  top: 10px !important;

  button {
    margin: 6px 4px;
    background: #3f3d3d;
    padding: 2px 6px;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
  }
`;
