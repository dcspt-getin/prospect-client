/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import {
  // createNewUrbanShapesProfile,
  updateUserProfile,
} from "src/store/profiles/actions";
import { getActiveProfile } from "store/profiles/selectors";

export default () => {
  const dispatch = useDispatch();
  const activeProfile = useSelector(getActiveProfile);
  const isLoading = useSelector((state) => state.profiles.isLoading);

  React.useEffect(() => {
    if (isLoading) return;

    console.log({ activeProfile });
    // should create a new one
    if (!activeProfile) {
      // dispatch(
      //   createNewUrbanShapesProfile({
      //     calibrations: [],
      //   })
      // );
    }
  }, []);

  const _debouncedUpdateProfile = useDebouncedCallback(
    // function
    (update) => {
      dispatch(
        updateUserProfile(activeProfile.id, {
          profile_data: { ...activeProfile.profile_data, ...update },
        })
      );
    },
    // delay in ms
    500
  );

  // const _updateProfileData = (update) => {
  //   return dispatch(
  //     updateUserProfile(activeProfile.id, {

  //     })
  //   );
  // };

  return [activeProfile && activeProfile.profile_data, _debouncedUpdateProfile];
  // const [profileData, _updateProfileData] = React.useState({});

  // return [profileData, _updateProfileData];
};
