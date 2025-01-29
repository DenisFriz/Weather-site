import ErrorComponent from "@components/Errors/ErrorComponent";
import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";
import Loader from "@ui-ux/Loader/Loader";
import s from "./index.module.scss";
import { Space } from "antd";

const CurrentWeather = () => {
  const { theme } = useTheme();
  const weatherData = useWeather();

  const loading = weatherData?.isLoading;
  const error = weatherData?.weatherError?.isError;
  const errorMSG = weatherData?.weatherError?.ErrorMessage;

  if (loading)
    return (
      <div style={{ position: "relative", marginTop: "100px" }}>
        <Loader />
      </div>
    );

  if (error && errorMSG) {
    return <ErrorComponent ErrorMessage={errorMSG} />;
  }

  const data = weatherData?.data;

  if (!data) return null;

  return (
    <div
      className={`${s.currentWeather} ${
        theme === "dark" ? `${s.currentWeather_dark}` : ""
      }`}
      data-testid="currentWeather"
    >
      <h3 className={s.currentWeather__title}>
        {data.location.name + ", " + data.location.country}
      </h3>
      <p className={s.currentWeather__subtitle}>
        Today, {data.location.localtime}
      </p>
      <div className={s.currentWeather__content}>
        <div className={s.wrapperImg}>
          <img
            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTJCq_dgaPULdy0GgzMuCDy4BqQW11izhCKo7vZotEts8vAFLlZ"
            alt="Img"
          />
        </div>
        <div className={s.currentWeather__degrees}>
          {data.current.temp_c} °C
        </div>
      </div>
      <Space className={s.currentWeather__detailInfo}>
        <ul className={s.currentWeather__list}>
          <li className={s.currentWeather__link}>
            Pressure in millibars
            <div className="detail-info">{data.current.pressure_mb} mb</div>
          </li>
          <li className={s.currentWeather__link}>
            Humidity
            <div className="detail-info">{data.current.humidity} %</div>
          </li>
          <li className={s.currentWeather__link}>
            Cloud
            <div className="detail-info">{data.current.cloud} %</div>
          </li>
          <li className={s.currentWeather__link}>
            Wind gust
            <div className="detail-info">{data.current.gust_kph} km/h</div>
          </li>
          <li className={s.currentWeather__link}>
            Wind speed
            <div className="detail-info">{data.current.wind_kph} km/h</div>
          </li>
        </ul>
      </Space>
      <Space className={s.currentWeather__detailInfo}>
        <ul className={s.currentWeather__list}>
          <li className={s.currentWeather__link}>
            5:30
            <div className="detail-info">93%</div>
          </li>
        </ul>
      </Space>
    </div>
  );
};

export default CurrentWeather;
