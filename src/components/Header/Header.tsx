import { useEffect, useState } from "react";
import s from "./index.module.scss";
import { MONTHS, DAYS_OF_WEEK } from "@constants/constants";
import { useWeather } from "@contexts/WeatherData";
import { Flex, Space, Button, Form, Input, Typography } from "antd";
import { useTheme } from "@contexts/Theme";

const { Text } = Typography;

type ErrorObj = {
  isError: boolean;
  errorCode: number;
  errorMessage: string;
};

type HeaderDate = {
  month: string;
  dayOfWeek: string;
  year: number | string;
};

const Header = () => {
  const { theme } = useTheme();
  const [city, setCity] = useState("");
  const [error, setError] = useState<ErrorObj>();
  const [date, setDate] = useState<HeaderDate>();
  const weatherData = useWeather();

  useEffect(() => {
    const tmpDate = new Date();
    const date: HeaderDate = {
      month: MONTHS[tmpDate.getMonth()],
      dayOfWeek: DAYS_OF_WEEK[tmpDate.getDay()],
      year: tmpDate.getFullYear(),
    };

    setDate(date);
  }, []);

  if (!weatherData) {
    return null;
  }
  const { updateData, updateCity } = weatherData;

  const handleFormSubmit = async (values: { city: string }) => {
    const city = values.city?.trim();
    if (!city || city.length == 0) {
      setError({
        isError: true,
        errorCode: 402,
        errorMessage: "Please, enter the city name using Latin characters.",
      });
    } else {
      setError({
        isError: false,
        errorCode: 200,
        errorMessage: "",
      });
      updateData({ city: city, days: "1" });
      updateCity(city);
      setCity("");
    }
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({
      isError: false,
      errorCode: 200,
      errorMessage: "",
    });
    setCity(e.target.value.replace(/[^a-zA-Z ]/g, ""));
  };

  return (
    <Flex component={"header"} justify="space-between" align="center">
      <Space direction="vertical">
        <Text className={s.header__dateInfoTop}>
          {date?.month} {date?.year}
        </Text>
        <Text className={s.header__dateInfoBottom} data-testid="date">
          {date?.dayOfWeek} {date?.month} {date?.year}
        </Text>
      </Space>
      <Form
        onFinish={handleFormSubmit}
        style={{ display: "flex", alignItems: "center", columnGap: "6px" }}
        className={`${s.header__form} ${
          theme === "dark" ? s.header__form_dark : ""
        }`}
      >
        <Form.Item style={{ margin: "0" }} name="city">
          <Input
            placeholder="Search city..."
            value={city}
            onChange={handleInput}
          />
        </Form.Item>
        <Form.Item style={{ margin: "0" }}>
          <Button
            type="primary"
            htmlType="submit"
            aria-label="Search"
            title="Search"
            data-testid="submit-btn"
          >
            Search
          </Button>
        </Form.Item>
        {error?.isError && (
          <div className={s.header__error}>{error.errorMessage}</div>
        )}
      </Form>
    </Flex>
  );
};

export default Header;
