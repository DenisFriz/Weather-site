import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import DaysList from "./components/DaysList/DaysList";
import Header from "./components/Header/Header";
import Tabs from "./components/Tabs/Tabs";
import Toggle from "./ui-ux/Toggle/Toggle";
import { useTheme } from "./contexts/Theme";
import { Col, Row } from "antd";

function App() {
  const { theme } = useTheme();
  return (
    <div className={`container ${theme === "dark" ? "container-dark" : ""}`}>
      <Row gutter={12} className="main-wrapper">
        <Toggle />
        <CurrentWeather />
        <Col className="main-right">
          <Header />
          <Tabs />
          <DaysList />
        </Col>
      </Row>
    </div>
  );
}

export default App;
