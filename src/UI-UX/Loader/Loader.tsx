import s from "./index.module.scss";

const Loader = () => {
  return (
    <div className={s.loader__overlay} data-testid="loader">
      <div className={s.loader__spinner}></div>
    </div>
  );
};

export default Loader;
