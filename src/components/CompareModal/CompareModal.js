import "./comparemodal.style.css";

import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Header, Table, Checkbox } from "semantic-ui-react";

import MonitoringContext from "../../contexts/MonitoringContext";

const CompareModal = ({ isOpen, closeModal, onHandleOk, selectedCities }) => {
  const [checkedCities, setCheckedCities] = useState({});
  const [allSelected, setAllSelected] = useState(false);

  const { cities } = useContext(MonitoringContext);

  useEffect(() => {
    if (isOpen) {
      const checkedData = {};

      selectedCities.forEach((item) => {
        checkedData[item] = true;
      });

      setCheckedCities(checkedData);
    }
  }, [isOpen]);

  const onChange = (cityName) => () => {
    setCheckedCities((prevState) => ({
      ...prevState,
      [cityName]: !prevState[cityName],
    }));
  };

  const selectAll = () => {
    const updatedState = { ...checkedCities };

    if (Object.keys(checkedCities).length === cities.length) {
      cities.forEach((item) => {
        updatedState[item.value] = false;
      });

      setAllSelected(false);
    } else {
      cities.forEach((item) => {
        updatedState[item.value] = true;
      });

      setAllSelected(true);
    }

    setCheckedCities(updatedState);
  };

  return (
    <Modal onClose={closeModal} open={isOpen} size="small">
      <Modal.Header>Compare Cities</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          <Header textAlign="center">Select One or More Cities</Header>
          <div className="cities-selector">
            <Table basic>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>
                    <Checkbox checked={allSelected} onChange={selectAll} />
                  </Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {cities.map((item) => (
                  <Table.Row key={item.key}>
                    <Table.Cell collapsing>
                      <Checkbox
                        checked={checkedCities[item.value]}
                        onChange={onChange(item.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          basic
          negative
          icon="cancel"
          content="Cancel"
          onClick={closeModal}
        />
        <Button
          basic
          inverted
          positive
          content="Compare"
          icon="checkmark"
          onClick={() => {
            const normalizedData = Object.keys(checkedCities).filter(
              (item) => checkedCities[item]
            );

            onHandleOk(normalizedData);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

CompareModal.defaultProps = {
  isOpen: false,
  selectedCities: [],
  closeModal: () => {},
  onHandleOk: () => {},
};

CompareModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  onHandleOk: PropTypes.func,
  selectedCities: PropTypes.arrayOf(PropTypes.string),
};

export default CompareModal;
