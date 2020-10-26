import React, { forwardRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const googlemapsLibraries = ["geometry", "visualization", "places"]; // whatever google libraries you need

export function withGoogleMaps(Component) {
  // eslint-disable-next-line react/display-name
  return forwardRef((props, ref) => {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: "AIzaSyBCYSSZRMXdDSsz1wL8Ya9o2B1T6xiqJpA",
      libraries: googlemapsLibraries,
    });
    if (isLoaded) {
      return <Component {...props} ref={ref} />;
    }
    return <div>Map loading</div>;
  });
}
