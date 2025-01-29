import { useTheme } from "@contexts/Theme";
import errorIMG from "@images/error_currentWeather.png";
import s from "./index.module.scss";

const ErrorComponent = ({ ErrorMessage }: { ErrorMessage: string }) => {
  const themeContext = useTheme();
  const theme = themeContext ? themeContext.theme : undefined;
  return (
    <div className={`${s.error} ${theme === "dark" ? `${s.error__dark}` : ""}`}>
      <img className={s.error__img} src={errorIMG} alt="Error img" />
      <p className={s.error__message}>{ErrorMessage}</p>
    </div>
  );
};

export default ErrorComponent;
