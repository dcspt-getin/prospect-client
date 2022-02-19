/* eslint-disable import/no-anonymous-default-export */
import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createNewUrbanShapesProfile,
//   updateUrbanShapesProfile,
// } from "src/store/urbanShapes/actions";
// import { getActiveProfile } from "store/urbanShapes/selectors";

export default () => {
  // const dispatch = useDispatch();
  // const activeProfile = useSelector(getActiveProfile);
  // const profiles = useSelector((state) => state.urbanShapes.profiles);
  // const isLoading = useSelector((state) => state.urbanShapes.isLoading);

  // React.useEffect(() => {
  //   if (isLoading) return;

  //   console.log({ activeProfile });
  //   // should create a new one
  //   if (!activeProfile) {
  //     dispatch(
  //       createNewUrbanShapesProfile({
  //         calibrations: [],
  //       })
  //     );
  //   }
  // }, [profiles]);

  // const _updateProfileData = (update) => {
  //   return dispatch(
  //     updateUrbanShapesProfile(activeProfile.id, {
  //       profile_data: { ...activeProfile.profile_data, ...update },
  //     })
  //   );
  // };

  // return [activeProfile && activeProfile.profile_data, _updateProfileData];
  const [profileData, _updateProfileData] = React.useState({});

  return [profileData, _updateProfileData];
};
