//css
import classes from "../../styles/loader.module.css";

const Loader = () => {
  return (
    <div className={classes["loader-container"]}>
      <span className={classes.loader} />
    </div>
  );
};

export default Loader;
