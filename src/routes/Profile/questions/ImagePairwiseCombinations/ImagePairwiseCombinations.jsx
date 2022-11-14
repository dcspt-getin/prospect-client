import React from "react";
import { useSelector } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";

import { getAppConfiguration } from "store/app/selectors";
import questionTypes from "helpers/questions/questionTypes";
import { getActiveProfile } from "store/profiles/selectors";
import { getQuestions } from "store/questions/selectors";
import { PAIRWISE_COMBINATIONS_TYPES } from "helpers/questions";

import BinaryChoice from "./BinaryChoice/BinaryChoice";
import WeightChoice from "./WeightChoice/WeightChoice";
import TerritorialUnitImage from "components/TerritorialUnitImage/TerrritorialUnitImage";
import useTerritorialCoverages from "hooks/useTerritorialCoverages";

const ImagePairwiseCombinations = (props) => {
  const { value, question } = props;
  const {
    image_pairwise_type: pairWiseType,
    territorial_coverages: territorialCoveragesIds,
  } = question;

  const [selectedTC, setSelectedTC] = React.useState(null);
  const [imagesSet, setImagesSet] = React.useState([]);
  const questionRef = React.useRef(question);

  questionRef.current = question;

  const activeProfile = useSelector(getActiveProfile);
  const questions = useSelector(getQuestions);
  const profile = activeProfile?.profile_data || {};
  const {
    territorialCoverages,
    loading: territorialCoveragesLoading,
    loadTerritorialCoverages,
  } = useTerritorialCoverages();

  const territorialCoverageQuestion = questions.find(
    (q) => q.question_type === questionTypes.TERRITORIAL_COVERAGE
  );
  const googleMapsApiKey = useSelector((state) =>
    getAppConfiguration(state, "GOOGLE_API_KEY")
  );

  React.useEffect(() => {
    if (territorialCoverages.length) return;

    loadTerritorialCoverages();
  }, []);

  React.useEffect(() => {
    let currentImagesCoordinates = imagesSet;

    let territorialCoverage;

    if (territorialCoverageQuestion) {
      territorialCoverage = territorialCoverages.find(
        (tc) =>
          tc.id === profile[territorialCoverageQuestion?.id]?.value?.selectedTC
      );
    } else if (territorialCoveragesIds) {
      territorialCoverage = territorialCoverages.find((tc) =>
        territorialCoveragesIds.split().includes(String(tc.id))
      );
    }

    if (!territorialCoverage) return;

    if (!currentImagesCoordinates || !currentImagesCoordinates.length) {
      currentImagesCoordinates = territorialCoverage.units
        // .slice(0, 4)
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
  }, [
    value,
    territorialCoverageQuestion,
    profile,
    territorialCoverages.length,
  ]);

  const _renderLocationImage = (option) => {
    const useGoogleStreetImages = questionRef.current.use_google_street_images;
    const use360Image = questionRef.current.use_360_image;

    return (
      <TerritorialUnitImage
        image={option}
        useGoogleStreetImages={useGoogleStreetImages}
        use360Image={use360Image}
        googleMapsApiKey={googleMapsApiKey}
      />
    );
  };

  const allProps = {
    ...props,
    selectedTC,
    imagesSet,
    renderLocationImage: _renderLocationImage,
  };

  // if (!territorialCoverageQuestion)
  //   return (
  //     <Message
  //       warning
  //       header="Not found any terriotorial coverage question!"
  //       content="To show this question is required to have terriotorial coverage question on questionaire."
  //     />
  //   );

  if (territorialCoveragesLoading)
    return (
      <Dimmer active inverted style={{ height: "300px", position: "relative" }}>
        <Loader size="large">Loading</Loader>
      </Dimmer>
    );
  if (!imagesSet.length) return "";

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
