import ErrorComponent from "@components/Errors/ErrorComponent";
import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";
import type { IForecastday } from "@global-types/main-types";
import Loader from "@ui-ux/Loader/Loader";
import Modal from "@ui-ux/Modal/Modal";
import { getDay } from "@utils/getDay";
import { useState } from "react";
import s from "./index.module.scss";
import { Flex, Button } from "antd";

const DaysList = () => {
  const weatherData = useWeather();

  const forecastData = weatherData?.data?.forecast;
  const loading = weatherData?.isLoading;
  const error = weatherData?.weatherError?.isError;
  const errorMSG = weatherData?.weatherError?.ErrorMessage;

  if (loading) {
    return (
      <div style={{ position: "relative", marginTop: "100px" }}>
        <Loader />
      </div>
    );
  }

  if (error && errorMSG) {
    return <ErrorComponent ErrorMessage={errorMSG} />;
  }

  const content = forecastData?.forecastday;

  return (
    <div className={s.days}>
      {content &&
        content.map((item, index) => (
          <Item key={index} data={item} index={index} />
        ))}
    </div>
  );
};

interface IItem {
  data: IForecastday;
  index: number;
}

function Item({ data, index }: IItem) {
  const [active, setActive] = useState(false);
  const { theme } = useTheme();

  return (
    <Flex
      vertical
      align="center"
      className={`${s.days__item} ${
        theme === "dark" ? `${s.days__item_dark}` : ""
      }`}
      data-testid="days-item"
    >
      <h4 className={s.days__day}>{getDay(data.date)}</h4>
      <Flex align="flex-end" className={s.days__temp}>
        <div className={s.days__tempMin}>
          <span>min</span> {data.day.mintemp_c}°
        </div>
        <div className={s.days__tempAvg}>
          <span>avg</span> {data.day.avgtemp_c}°
        </div>
        <div className={s.days__tempMax}>
          <span>max</span> {data.day.maxtemp_c}°
        </div>
      </Flex>
      <Button
        onClick={() => setActive(true)}
        className={`btn ${theme === "dark" ? "btn_dark" : ""}`}
        aria-label="More info"
        title="More info"
      >
        More info
      </Button>
      <Modal active={active} setActive={setActive} index={index} />
    </Flex>
  );
}

export default DaysList;
