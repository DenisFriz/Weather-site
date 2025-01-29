import { Dispatch, SetStateAction } from "react";
import s from "./index.module.scss";
import { createPortal } from "react-dom";
import { useTheme } from "@contexts/Theme";
import { useWeather } from "@contexts/WeatherData";

interface IModal {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  index: number;
}

const Modal = ({ active, setActive, index }: IModal) => {
  const { theme } = useTheme();
  const weatherContext = useWeather();
  const forecast = weatherContext?.data;

  const formatDate = (date: string) => {
    const dateObject = new Date(date);
    const dayOfWeek = dateObject.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return dayOfWeek;
  };

  const content = forecast?.forecast?.forecastday[index];
  if (content == undefined) {
    return null;
  }

  const portalHTML = (
    <div
      className={active ? s.overlay : s.hidden}
      onClick={() => setActive(false)}
      data-testid="modal"
    >
      <div
        className={`${s.modal} ${theme === "dark" ? `${s.modal__dark}` : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.modal__astro}>
          <div className={s.modal__title}>Astro:</div>
          <div className={s.modal__astroItem}>
            {formatDate(content?.date)}
            <div className={s.modal__astroPhase}>
              {content?.astro.moon_phase}
            </div>
            <div className={s.modal__astroUl}>
              <div> Moon rise: {content.astro.moonrise}</div>
              <div> Moon set: {content.astro.moonset}</div>
              <div> Sun rise:{content.astro.sunrise}</div>
              <div> Sun set: {content.astro.sunset}</div>
            </div>
          </div>
        </div>
        <div className={s.arrowClose} onClick={() => setActive(false)}>
          X
        </div>
      </div>
    </div>
  );
  return active ? createPortal(portalHTML, document.body) : null;
};

export default Modal;
