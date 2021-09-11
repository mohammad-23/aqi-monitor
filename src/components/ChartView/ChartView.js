import "./chartView.style.css";

import React, { useState, useContext } from "react";
import { Button, Select, Form } from "semantic-ui-react";

import CompareModal from "../CompareModal";
import { chartTypes, renderChart } from "../../utils/constants";
import MonitoringContext from "../../contexts/MonitoringContext";

const ChartView = () => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState("Line");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const { cities } = useContext(MonitoringContext);

  const onCitySelect = (event, { value }) => {
    setSelectedCities(value);
  };

  const openModal = () => {
    setIsCompareModalOpen(true);
  };

  const closeModal = () => {
    setIsCompareModalOpen(false);
  };

  const onCitiesSelect = (selectedValues) => {
    setSelectedCities((prevState) => [
      ...new Set([...prevState, ...selectedValues]),
    ]);
    setIsCompareModalOpen(false);
  };

  const onChartTypeSelect = (event) => {
    setSelectedChartType(event.target.innerText.toLowerCase());
  };

  return (
    <div>
      <Form className="chart-type-selector">
        <Form.Field
          control={Select}
          defaultValue="Line"
          selection
          options={chartTypes}
          onChange={onChartTypeSelect}
          label={{
            children: "Select Chart Type",
            htmlFor: "form-select-control-chart-type",
          }}
          searchInput={{ id: "form-select-control-chart-type" }}
        />
      </Form>
      <div className="actions-container">
        <Select
          multiple
          onChange={onCitySelect}
          placeholder="Select your country"
          options={cities}
          value={selectedCities}
        />
        <Button primary disabled={!selectedCities} onClick={openModal}>
          Compare
        </Button>
      </div>
      {selectedCities.length
        ? renderChart(selectedChartType, { selectedCities })
        : null}
      <CompareModal
        cities={cities}
        selectedCities={selectedCities}
        isOpen={isCompareModalOpen}
        closeModal={closeModal}
        onHandleOk={onCitiesSelect}
      />
    </div>
  );
};

export default ChartView;
