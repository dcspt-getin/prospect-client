import React from "react";
import { useSelector } from "react-redux";
import { Message, Image } from "semantic-ui-react";
import styled from "styled-components";

import GoogleStreetView from "components/GoogleStreetView";
import { getAppConfiguration } from "store/app/selectors";
import questionTypes from "helpers/questions/questionTypes";
import { getActiveProfile } from "store/profiles/selectors";
import { getQuestions } from "store/questions/selectors";
import { PAIRWISE_COMBINATIONS_TYPES } from "helpers/questions";
import BinaryChoice from "./BinaryChoice/BinaryChoice";
import WeightChoice from "./WeightChoice/WeightChoice";

const ImagePairwiseCombinations = (props) => {
  const { value, question } = props;
  const { image_pairwise_type: pairWiseType } = question;

  const [selectedTC, setSelectedTC] = React.useState(null);
  const [imagesSet, setImagesSet] = React.useState([]);
  const questionRef = React.useRef(question);

  questionRef.current = question;

  const activeProfile = useSelector(getActiveProfile);
  const questions = useSelector(getQuestions);
  const profile = activeProfile?.profile_data || {};
  const territorialCoverages = useSelector(
    (state) => state.urbanShapes.territorialCoverages
  );
  const territorialCoverageQuestion = questions.find(
    (q) => q.question_type === questionTypes.TERRITORIAL_COVERAGE
  );
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );

  React.useEffect(() => {
    if (!territorialCoverageQuestion) return;

    let currentImagesCoordinates = imagesSet;

    const territorialCoverage = territorialCoverages.find(
      (tc) =>
        tc.id === profile[territorialCoverageQuestion?.id]?.value?.selectedTC
    );

    if (!territorialCoverage) return;

    if (!currentImagesCoordinates || !currentImagesCoordinates.length) {
      currentImagesCoordinates = territorialCoverage.units
        .slice(0, 4)
        .reduce((acc, entry) => {
          const randomImage =
            entry.images[Math.floor(Math.random() * entry.images.length)];

          return [
            ...acc,
            {
              [entry.tucode]: randomImage,
            },
          ];
        }, []);

      setImagesSet(currentImagesCoordinates);
    }
    setSelectedTC(territorialCoverage);
  }, [value, territorialCoverageQuestion, profile]);

  const _renderLocationImage = (option) => {
    if (option.image_url)
      return (
        <ImageContainer
          style={{ backgroundImage: `url(${option.image_url})` }}
        ></ImageContainer>
      );

    return (
      <GoogleStreetView
        apiKey={googleMapsApiKey}
        streetViewPanoramaOptions={{
          position: option.geometry,
        }}
      />
    );
  };

  const allProps = {
    ...props,
    selectedTC,
    imagesSet,
    renderLocationImage: _renderLocationImage,
  };

  if (!territorialCoverageQuestion)
    return (
      <Message
        warning
        header="Not found any terriotorial coverage question!"
        content="To show this question is required to have terriotorial coverage question on questionaire."
      />
    );

  switch (pairWiseType) {
    case PAIRWISE_COMBINATIONS_TYPES.BINARY_CHOICE:
      return <BinaryChoice {...allProps} />;

    case PAIRWISE_COMBINATIONS_TYPES.WEIGHT_BASED_CHOICE:
      return <WeightChoice {...allProps} />;

    default:
      break;
  }

  return <BinaryChoice {...allProps} />;
};

export default ImagePairwiseCombinations;

const ImageContainer = styled.div`
  background-size: cover;
  background-position: center;
`;
