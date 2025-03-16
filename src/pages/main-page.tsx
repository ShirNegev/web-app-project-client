import Posts from "../components/posts";
import Recipes from "../components/recipes";

const MainPage: React.FC = () => {
  return (
    <div className="row" style={{ width: "100%" }}>
        <h2 className="container d-flex justify-content-center align-items-center">Food feed</h2>
        <div className="col-md-10 align-items-center">
        <Posts></Posts>
        </div>
        <div className="col-md-2 container d-flex justify-content-center align-items-center ">
        <Recipes></Recipes>
        </div>
    </div>
  );
};

export default MainPage;