/* eslint-disable no-console */
import { Component } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import MonitoringContext from "../../contexts/MonitoringContext";

class SocketProvider extends Component {
  static defaultProps = {
    children: null,
  };

  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      aqiDetails: [],
      cities: [],
      aqiHistory: {},
    };
  }

  componentDidMount() {
    this.connect();
  }

  timeout = 250;

  connect = () => {
    const ws = new WebSocket("wss://city-ws.herokuapp.com/");
    const that = this;
    let connectInterval;

    ws.onopen = () => {
      this.setState({ ws });

      that.timeout = 250;
      clearTimeout(connectInterval);
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      // Get List of All Cities
      const cities = parsedData.map((item) => item.city);

      const totalCities = [
        ...this.state.cities.map((item) => item.value),
        ...cities,
      ];
      const uniqueCities = [...new Set(totalCities)];

      if (uniqueCities.length !== this.state.cities) {
        const normalizedData = uniqueCities.map((item) => ({
          key: item,
          value: item,
          text: item,
        }));

        this.setState({ cities: normalizedData });
      }

      // Store Previous Data of all cities
      const historyData = { ...this.state.aqiHistory };

      parsedData.forEach((item) => {
        if (historyData[item.city]) {
          if (historyData[item.city].length >= 12) {
            historyData[item.city].shift();
          }

          historyData[item.city].push({
            ...item,
            aqi: Number(item.aqi.toFixed(2)),
            updatedAt: dayjs(new Date().getTime()).format("hh:mm:ss"),
            updatedAtISO: new Date().getTime(),
          });
        } else {
          historyData[item.city] = [
            {
              ...item,
              aqi: Number(item.aqi.toFixed(2)),
              updatedAtISO: new Date().getTime(),
              updatedAt: dayjs(new Date().getTime()).format("hh:mm:ss"),
            },
          ];
        }
      });

      this.setState({
        aqiDetails: JSON.parse(event.data),
        aqiHistory: historyData,
      });
    };

    // websocket onclose event listener
    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      // increment retry interval
      that.timeout = that.timeout + that.timeout;
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
    };

    ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  check = () => {
    const { ws } = this.state;

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      // check if websocket instance is closed, if so call `connect` function.
      this.connect();
    }
  };

  render() {
    return (
      <MonitoringContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </MonitoringContext.Provider>
    );
  }
}

export default SocketProvider;
