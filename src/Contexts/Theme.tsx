import { DARK_THEME, LIGHT_THEME } from "@constants/constants";
import {
  ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ITheme {
  theme: Theme;
  changeTheme: () => void;
}

const ThemeContext = createContext<ITheme | null>(null);

const Theme = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (window.localStorage.getItem("theme") as Theme) || LIGHT_THEME;
  });

  useLayoutEffect(() => {
    if (!window.localStorage.getItem("theme")) {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const changeTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === DARK_THEME ? LIGHT_THEME : DARK_THEME;
      window.localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const data: ITheme = {
    theme,
    changeTheme,
  };
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used only within Theme.Provider");
  }
  return theme;
};

export default Theme;
