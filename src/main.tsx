import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.scss";
import WeatherData from "./contexts/WeatherData.tsx";
import Theme, { useTheme } from "./contexts/Theme.tsx";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const AntdThemeProvider = () => {
  const { theme } = useTheme();

  // Здесь мы изменяем цвета кнопки в зависимости от темы
  const buttonColor = theme === "light" ? "#4096ff" : "#daa45e";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: buttonColor,
          colorText: theme === "light" ? "#000" : "#fff", // Устанавливаем основной цвет кнопки
        },
        components: {
          Button: {
            colorPrimary: buttonColor, // Индивидуальные настройки для кнопок
          },
          List: {},
        },
      }}
    >
      <WeatherData>
        <App />
      </WeatherData>
    </ConfigProvider>
  );
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Theme>
    <QueryClientProvider client={queryClient}>
      <AntdThemeProvider />
    </QueryClientProvider>
  </Theme>
);
