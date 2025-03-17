import Posts from "../components/posts";
import Profile from "../components/profile";
import Recipes from "../components/recipes";

const MainPage: React.FC = () => {
  const onUpdateProfile = () => {
    window.location.reload();
  }

  return (
    <div className="row" style={{ width: "100%" }}>
        <h2 className="container d-flex justify-content-center align-items-center">Food feed</h2>
        <div className="col-md-4 container d-flex flex-column align-items-center px-5">
        <Profile onUpdateProfile={onUpdateProfile}></Profile>
        </div>
        <div className="col-md-6 align-items-center px-2">
        <Posts></Posts>
        </div>
        <div className="col-md-2 container d-flex align-items-center px-4">
        <Recipes></Recipes>
        </div>
    </div>
  );
};

export default MainPage;