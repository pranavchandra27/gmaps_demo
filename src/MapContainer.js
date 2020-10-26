/* global google */
import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  HeatmapLayer,
  MarkerClusterer,
  Marker,
  Data,
} from "@react-google-maps/api";
import { withGoogleMaps } from "./withGoogleMaps";
import MapData from "./data/heatmap_data.json";
import SelectOptions from "./SelectOptions";
import { useData } from "./context";

const center = {
  lat: 36.205189,
  lng: -94.779694,
};

let censusMin = Number.MAX_VALUE;
let censusMax = -Number.MAX_VALUE;

const MapContiner = () => {
  const [{ select }] = useData();
  const mapRef = useRef(null);
  const [name, setName] = useState("");
  const [censusData, setCensusData] = useState("");
  const [percent, setPercent] = useState("");

  useEffect(() => {
    loadCensusData(select);
  }, [select]);

  const positions = () => {
    const latLng = MapData.map(data => ({
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    }));

    return latLng;
  };

  // [HeatMap Layers Data]
  const heatMapsLatLng = () => {
    const positions = MapData.map(data => {
      return new google.maps.LatLng(data.lat, data.lng);
    });
    return positions;
  };

  // [MarkerClusterer Options]
  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

  const onClick = (...args) => {
    console.log("onClick args: ", args);
  };

  // Loding polygon data for counties
  function onMapLoad(map) {
    mapRef.current = map;
    map.data.loadGeoJson(
      "https://cors-anywhere.herokuapp.com/https://shelfsmartdata.com/app/assets/census/2010CountyPoly.json",
      {
        idPropertyName: "COUNTYUNIQUE",
      }
    );
    map.data.setStyle(styleFeature);
    map.data.addListener("mouseover", mouseInToRegion);
    map.data.addListener("mouseout", mouseOutOfRegion);
  }

  const onDataLoad = data => {
    console.log("data: ", data);
  };

  // Fetch and load census data
  const loadCensusData = async variable => {
    const res = await fetch(
      `https://api.census.gov/data/2018/acs/acs5/profile?get=${variable},NAME&for=county:*&key=39e297a0b0d762ab80bdad4e13ce8e18d43a9c1a`
    );
    const censusData = await res.json();
    censusData.shift(); // the first row contains column names
    censusData.forEach(row => {
      let censusVariable = parseFloat(row[0]);
      let countyId = `${row[2]}_${row[3]}`;

      // keep track of min and max values
      if (countyId === "51_515") {
      } else {
        if (censusVariable < censusMin) {
          censusMin = censusVariable;
        }
        if (censusVariable > censusMax) {
          censusMax = censusVariable;
        }

        // update the existing row with the new data

        if (mapRef.current.data.getFeatureById(countyId) !== undefined) {
          //console.log(mapRef.current.data.getFeatureById(countyId));
          mapRef.current.data
            .getFeatureById(countyId)
            .setProperty("census_variable", censusVariable);
        }
      }
    });

    //console.log(censusData);
  };

  function styleFeature(feature) {
    //console.log(feature.getProperty("county"));
    const low = [190, 5, 60]; // color of smallest datum
    const high = [360, 100, 60]; // color of largest datum

    // delta represents where the value sits between the min and max
    const delta =
      (feature.getProperty("census_variable") - censusMin) /
      (censusMax - censusMin);

    const color = [];
    for (let i = 0; i < 3; i++) {
      // calculate an integer color based on the delta
      color[i] = (high[i] - low[i]) * delta + low[i];
    }

    // determine whether to show this shape or not
    let showRow = true;
    if (
      feature.getProperty("census_variable") == null ||
      isNaN(feature.getProperty("census_variable"))
    ) {
      showRow = false;
    }

    let outlineWeight = 0.5,
      zIndex = 1;
    if (feature.getProperty("county") === "hover") {
      outlineWeight = zIndex = 2;
    }

    return {
      strokeWeight: outlineWeight,
      strokeColor: "#fff",
      zIndex: zIndex,
      fillColor: "hsl(" + color[0] + "," + color[1] + "%," + color[2] + "%)",
      fillOpacity: 0.3,
      visible: showRow,
    };
  }

  /**
   * Responds to the mouse-in event on a map shape (state).
   *
   * @param {?google.maps.MouseEvent} e
   */

  function mouseInToRegion(e) {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty("county", "hover");
    const percent =
      ((e.feature.getProperty("census_variable") - censusMin) /
        (censusMax - censusMin)) *
      100;

    setPercent(percent);
    // update the label
    setName(e.feature.getProperty("NAME"));
    setCensusData(e.feature.getProperty("census_variable").toLocaleString());
  }

  /**
   * Responds to the mouse-out event on a map shape (state).
   *
   */
  function mouseOutOfRegion(e) {
    // reset the hover state, returning the border to normal
    e.feature.setProperty("county", "normal");
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "900px", height: "500px" }}
      center={center}
      zoom={4}
      onLoad={onMapLoad}
      onClick={onClick}
      options={{
        styles: [
          {
            featureType: "water",
            stylers: [{ color: "#46bcec" }, { visibility: "on" }],
          },
          { featureType: "landscape", stylers: [{ color: "#f2f2f2" }] },
          {
            featureType: "road",
            stylers: [{ saturation: -100 }, { lightness: 45 }],
          },
          {
            featureType: "road.highway",
            stylers: [{ visibility: "simplified" }],
          },
          {
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#444444" }],
          },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
        ],
      }}>
      <SelectOptions county={name} info={censusData} percent={percent} />
      <HeatmapLayer
        data={heatMapsLatLng()}
        options={{ radius: 20, zIndex: 10 }}
      />
      <MarkerClusterer options={options}>
        {clusterer =>
          positions().map(location => (
            <Marker
              key={location.lat}
              position={new google.maps.LatLng(location.lat, location.lng)}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClusterer>
      <Data onLoad={onDataLoad} />
    </GoogleMap>
  );
};

export default withGoogleMaps(MapContiner);
