import React from "react";

const MonitoringContext = React.createContext({
  aqiDetails: [],
  cities: [],
  aqiHistory: {},
});

export default MonitoringContext;
