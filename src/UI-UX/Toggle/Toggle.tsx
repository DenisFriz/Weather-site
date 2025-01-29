import { useTheme } from "@contexts/Theme";
import s from "./index.module.scss";

const Toggle = () => {
  const { theme, changeTheme } = useTheme();

  return (
    <div className={s.toggle__container}>
      <input
        type="checkbox"
        id="check"
        className={s.toggle}
        onChange={changeTheme}
        value={theme}
        checked={theme === "dark"}
      />
      <label htmlFor="check">
        {theme === "light" ? "Light mode" : "Dark mode"}
      </label>
    </div>
  );
};

export default Toggle;
