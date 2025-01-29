import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";
import s from "./index.module.scss";
import { Flex } from "antd";

type TabsItems = "Today" | "Tomorrow" | "Next 7 day";

const TabsList: TabsItems[] = ["Today", "Tomorrow", "Next 7 day"];

const Tabs = () => {
  const themeContext = useTheme();
  const theme = themeContext ? themeContext.theme : undefined;
  const weatherContext = useWeather();
  const currentCity = weatherContext ? weatherContext.currentCity : undefined;

  const updateWeatherData = weatherContext
    ? weatherContext.updateData
    : undefined;

  const handleClickTabs = async (tab: TabsItems) => {
    if (!currentCity || !updateWeatherData) return null;

    switch (tab) {
      case "Today": {
        await updateWeatherData({ city: currentCity, days: "1" });
        break;
      }
      case "Tomorrow": {
        await updateWeatherData({ city: currentCity, days: "2" });
        break;
      }
      case "Next 7 day": {
        await updateWeatherData({ city: currentCity, days: "7" });
        break;
      }
      default:
        console.error("Unknown tab:", tab);
        return;
    }
  };

  return (
    <div className={s.tabs}>
      <Flex component={"ul"} className={s.tabs__list}>
        {TabsList.map((tab, index) => (
          <li
            className={`${s.tabs__link} ${
              theme === "dark" ? `${s.tabs__link_dark}` : ""
            }`}
            key={index}
            onClick={() => handleClickTabs(tab)}
            aria-label={tab}
            title={tab}
          >
            {tab}
          </li>
        ))}
      </Flex>
    </div>
  );
};

export default Tabs;
