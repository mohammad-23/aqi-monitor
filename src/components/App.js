import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { useState } from "react";
import { Icon } from "semantic-ui-react";

import TableView from "./TableView";
import SocketProvider from "./SocketProvider";
import ChartView from "./ChartView/ChartView";

const TABLE_VIEW = "table-view";
const CHART_VIEW = "chart-view";

const App = () => {
  const [activeView, setActiveView] = useState(TABLE_VIEW);

  const switchView = (view) => () => {
    setActiveView(view);
  };

  return (
    <div className="app">
      <div className="app-header">Air Quality Monitor</div>
      <div className="app-container">
        <div className="view-switch">
          <div
            className={`view-icon ${activeView === TABLE_VIEW ? "active" : ""}`}
            onClick={switchView(TABLE_VIEW)}
          >
            <Icon name="table" size="large" />
          </div>
          <div
            className={`view-icon ${activeView === CHART_VIEW ? "active" : ""}`}
            onClick={switchView(CHART_VIEW)}
          >
            <Icon name="chart bar" size="large" />
          </div>
        </div>
        <SocketProvider>
          {activeView === TABLE_VIEW ? <TableView /> : <ChartView />}
        </SocketProvider>
      </div>
    </div>
  );
};

export default App;
