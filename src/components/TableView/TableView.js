import "./tableView.style.css";

import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Table } from "semantic-ui-react";

import MonitoringContext from "../../contexts/MonitoringContext";

const isInRange = (value, min, max) => {
  if (value > min && value < max) {
    return true;
  }

  return false;
};

const getLastUpdated = (lastUpdated) => {
  const now = new Date().getTime();
  const difference = (now - lastUpdated) / 1000;

  if (difference < 2) {
    return "now";
  }

  if (difference <= 10) {
    return "A few seconds ago";
  }

  if (isInRange(difference, 59, 120)) {
    return "A minute ago";
  }

  return `${Math.floor(difference)} seconds ago`;
};

const AQICell = ({ value }) => {
  const getClassName = () => {
    const aqiValue = Number(value);

    switch (true) {
      case aqiValue < 50:
        return "good";

      case aqiValue < 100:
        return "satisfactory";

      case aqiValue < 200:
        return "moderate";

      case aqiValue < 300:
        return "poor";

      case aqiValue < 400:
        return "very-poor";

      case aqiValue > 400:
        return "severe";

      default:
        return "";
    }
  };

  return <div className={`aqi ${getClassName()}`}>{value}</div>;
};

const TableView = React.memo(() => {
  const { aqiHistory } = useContext(MonitoringContext);

  return (
    <div className="container">
      <Table celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>AQI</Table.HeaderCell>
            <Table.HeaderCell>Last Updated</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(aqiHistory).map((item) => (
            <Table.Row key={item}>
              <Table.Cell>{item}</Table.Cell>
              <Table.Cell>
                <AQICell value={aqiHistory[item].slice(-1)[0].aqi} />
              </Table.Cell>
              <Table.Cell>
                {getLastUpdated(aqiHistory[item].slice(-1)[0].updatedAtISO)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
});

AQICell.defaultProps = {
  value: null,
};

AQICell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TableView;
