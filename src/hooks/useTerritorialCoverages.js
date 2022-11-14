import { useDispatch, useSelector } from "react-redux";

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
    dispatch(fetchTerritorialCoverages());
  };

  return {
    territorialCoverages,
    loadTerritorialCoverages,
    loading,
  };
};

export default useTerritorialCoverages;
