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
  const activeProfileDataRef = React.useRef(activeProfileData);

  activeProfileDataRef.current = activeProfileData;

  const _checkAnyChanges = (newData) => {
    const updateKeys = Object.keys(newData);

    const anyChange = updateKeys.reduce((result, key) => {
      if (!result) return false;
      if (!(activeProfile.profile_data || {})[key]) return false;

      return isEqual(activeProfile.profile_data[key], newData[key]);
    }, true);

    return anyChange;
  };
  const _debouncedSaveProfile = useDebouncedCallback(
    // function
    () => {
      if (_checkAnyChanges(activeProfileData) === true) return;

      dispatch(
        updateUserProfile(activeProfile.id, {
          profile_data: {
            ...(activeProfile.profile_data || {}),
            ...activeProfileData,
          },
        })
      );
    },
    // delay in ms
    200
  );
  const _updateProfile = (update, updateServer = true) => {
    setActiveProfileData({ ...activeProfileData, ...update });
    if (updateServer) _debouncedSaveProfile(update);
  };

  React.useEffect(() => {
    if (isLoading) return;

    const newProfileData = activeProfile?.profile_data || {};
    if (isEqual(newProfileData, activeProfileData)) return;

    setActiveProfileData(newProfileData);
  }, [isLoading, activeProfile?.profile_data]);

  return [activeProfileData, _updateProfile, _debouncedSaveProfile];
};
