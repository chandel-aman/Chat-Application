import classes from "../../styles/nopagefound.module.css";

const NoPageFound = () => {
  return (
    <div className={classes["nopagefound-container"]}>
      <h1>404 Error!</h1>
      <h2>The page you are looking for was not found!</h2>
    </div>
  );
};

export default NoPageFound;
