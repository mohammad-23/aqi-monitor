import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Scatter } from "@ant-design/charts";

import MonitoringContext from "../../contexts/MonitoringContext";

const ScatterChart = ({ selectedCities }) => {
  const [data, setData] = useState([]);

  const { aqiHistory } = useContext(MonitoringContext);

  useEffect(() => {
    const chartData = [];

    for (const item in aqiHistory) {
      if (selectedCities.includes(item)) {
        chartData.push(...aqiHistory[item]);
      }
    }

    const sortedData = chartData.sort(
      (current, next) => current.updatedAtISO - next.updatedAtISO
    );

    setData(sortedData);
  }, [aqiHistory]);

  const config = {
    appendPadding: 30,
    data: data,
    xField: "updatedAt",
    yField: "aqi",
    sizeField: "aqi",
    colorField: "city",
    size: [4, 16],
    meta: {
      updatedAt: {
        alias: "Updated At",
      },
      aqi: {
        alias: "AQI",
      },
      city: {
        alias: "City",
      },
    },
    shape: "circle",
    pointStyle: {
      fillOpacity: 0.8,
      stroke: "#bbb",
    },
    xAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
    },
    yAxis: { line: { style: { stroke: "#aaa" } } },
    tooltip: {
      fields: ["updatedAt", "aqi"],
      enterable: true,
    },
  };

  return <Scatter {...config} />;
};

ScatterChart.defaultProps = {
  selectedCities: [],
};

ScatterChart.propTypes = {
  selectedCities: PropTypes.arrayOf(PropTypes.string),
};

export default ScatterChart;
