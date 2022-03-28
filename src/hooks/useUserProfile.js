/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import isEqual from "lodash/isEqual";
import {
  // createNewUrbanShapesProfile,
  updateUserProfile,
} from "src/store/profiles/actions";
import { getActiveProfile } from "store/profiles/selectors";

export default () => {
  const dispatch = useDispatch();
  const activeProfile = useSelector(getActiveProfile);
  const isLoading = useSelector((state) => state.profiles.isLoading);

  const [activeProfileData, setActiveProfileData] = React.useState(
    activeProfile?.profile_data
  );

  React.useEffect(() => {
    if (isLoading) return;

    const newProfileData = activeProfile?.profile_data || {};
    if (isEqual(newProfileData, activeProfileData)) return;

    setActiveProfileData(newProfileData);
  }, [isLoading, activeProfile?.profile_data]);

  const _debouncedUpdateProfile = useDebouncedCallback(
    // function
    (update) => {
      const updateKeys = Object.keys(update);

      const anyChange = updateKeys.reduce((result, key) => {
        if (!result) return false;
        if (!activeProfile.profile_data[key]) return false;

        return isEqual(activeProfile.profile_data[key], update[key]);
      }, true);

      if (anyChange === true) return;

      dispatch(
        updateUserProfile(activeProfile.id, {
          profile_data: { ...activeProfile.profile_data, ...update },
        })
      );
    },
    // delay in ms
    200
  );

  const _updateProfile = (update) => {
    setActiveProfileData({ ...activeProfileData, ...update });
    _debouncedUpdateProfile(update);
  };

  return [activeProfileData, _updateProfile, isLoading];
};
