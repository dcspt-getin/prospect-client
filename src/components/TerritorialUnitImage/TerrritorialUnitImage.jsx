import React, { useState } from "react";
import { Modal } from "semantic-ui-react";
import styled from "styled-components";
import { Pannellum } from "pannellum-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import GoogleStreetView from "components/GoogleStreetView";
import sprites from "./sprites.svg";

const TerritorialUnitImage = ({
  image,
  useGoogleStreetImages,
  use360Image,
  googleMapsApiKey,
  fullscreen = false,
  closeFullScreen,
}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  if (!image) return "image not available";

  if (showFullScreen) {
    return (
      <MyModal size="fullscreen" open>
        <FullScreenImage>
          <TerritorialUnitImage
            image={image}
            useGoogleStreetImages={useGoogleStreetImages}
            use360Image={use360Image}
            googleMapsApiKey={googleMapsApiKey}
            fullscreen
            closeFullScreen={() => setShowFullScreen(false)}
          />
        </FullScreenImage>
      </MyModal>
    );
  }

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
          height={window.innerWidth > 600 ? "300px" : "240px"}
          image={image.image || image.image_url}
          pitch={10}
          yaw={180}
          hfov={110}
          autoLoad
        />
      </ImageContainer>
    );
  }

  return (
    // <ImageContainer
    //   style={{ backgroundImage: `url(${image.image || image.image_url})` }}
    // />
    <TransformWrapper
      initialScale={4}
      initialPositionX={-150}
      initialPositionY={-150}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <Tools>
            <ZoomInButton onClick={() => zoomIn()} />
            <ZoomOutButton onClick={() => zoomOut()} />
            {!fullscreen && (
              <FullscreenButton onClick={() => setShowFullScreen(true)} />
            )}
            {fullscreen && (
              <FullscreenButton close onClick={() => closeFullScreen()} />
            )}
          </Tools>
          <TransformComponent
            wrapperStyle={{
              ...(fullscreen
                ? {
                    height: "100vh",
                    width: "100%",
                  }
                : {}),
            }}
          >
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
  position: absolute;
  z-index: 1000;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #999;
  border-color: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  transform: translateZ(9999px);
  width: 26px !important;
  height: 52px !important;
  left: 18px !important;
  top: 32px !important;
`;

const ZoomInButton = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 0;
  border-radius: 3px 3px 0 0;
  background-image: url(${sprites});
  cursor: pointer;
`;

const ZoomOutButton = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  top: 26px;
  background-position: 0 -26px;
  border-top: 1px solid #ddd;
  border-top-color: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 3px 3px;
  background-image: url(${sprites});
  cursor: pointer;
`;

const FullscreenButton = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  bottom: -32px;
  border-top: 1px solid #ddd;
  border-top-color: rgba(0, 0, 0, 0.1);
  border-radius: 0 0 3px 3px;
  background-image: url(${sprites});
  background-position: 0 -50px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #999;
  border-color: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  background-size: 25px;

  ${({ close }) =>
    close &&
    `
    background-position: 0 -76px;
  `}
`;

const MyModal = styled(Modal)`
  &&&& {
    width: 100% !important;
  }
`;

const FullScreenImage = styled.div``;
