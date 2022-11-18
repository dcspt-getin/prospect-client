import { useDispatch, useSelector } from "react-redux";
import { flatten } from "ramda";
import { useMemo } from "react";

import {
  getTerritorialCoverages,
  getTerritorialCoveragesLoading,
} from "store/urbanShapes/selectors";
import { fetchTerritorialCoverages } from "store/urbanShapes/actions";

const useTerritorialCoverages = () => {
  const dispatch = useDispatch();

  const territorialCoverages = useSelector(getTerritorialCoverages);
  const loading = useSelector(getTerritorialCoveragesLoading);

  const loadTerritorialCoverages = () => {
    if (territorialCoverages.length > 0) {
      return;
    }

    dispatch(fetchTerritorialCoverages());
  };

  const allImages = useMemo(
    () =>
      territorialCoverages.reduce((acc, cur) => {
        return [
          ...acc,
          ...flatten(
            cur.units.map((tu) =>
              tu.images.map((i) => ({
                ...i,
                unit: tu,
              }))
            )
          ),
        ];
      }, []),
    [territorialCoverages]
  );

  return {
    territorialCoverages,
    loadTerritorialCoverages,
    loading,
    allImages,
  };
};

export default useTerritorialCoverages;
