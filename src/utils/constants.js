import LineChart from "../components/LineChart";
import ScatterChart from "../components/ScatterChart";

export const chartTypes = [
  {
    key: "line",
    value: "Line",
    text: "Line",
  },
  {
    key: "scatter",
    value: "Scatter",
    text: "Scatter",
  },
];

export const renderChart = (selectedChartType, props) => {
  switch (selectedChartType) {
    case "line":
      return <LineChart {...props} />;

    case "scatter":
      return <ScatterChart {...props} />;

    default:
      return <LineChart {...props} />;
  }
};
