import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Line } from "@ant-design/charts";

import MonitoringContext from "../../contexts/MonitoringContext";

const LineChart = ({ selectedCities }) => {
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
    seriesField: "city",
    meta: {
      updatedAt: {
        alias: "Updated At",
      },
      aqi: {
        alias: "AQI",
      },
    },
    yAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
      title: {
        text: "AQI",
        style: { fontSize: 16, stroke: "#aaa" },
      },
    },
    xAxis: {
      grid: { line: { style: { stroke: "#eee" } } },
      line: { style: { stroke: "#aaa" } },
      title: {
        text: "Updated At",
        style: { fontSize: 16, stroke: "#aaa" },
      },
    },
    tooltip: {
      fields: ["updatedAt", "aqi"],
      enterable: true,
    },
  };

  return <Line {...config} />;
};

LineChart.defaultProps = {
  selectedCities: [],
};

LineChart.propTypes = {
  selectedCities: PropTypes.arrayOf(PropTypes.string),
};

export default LineChart;
