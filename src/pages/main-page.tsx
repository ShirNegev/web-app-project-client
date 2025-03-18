import Posts from "../components/posts";
import Profile from "../components/profile";
import Recipes from "../components/recipes";

const MainPage: React.FC = () => {
  const onUpdateProfile = () => {
    window.location.reload();
  }

  return (
    <div className="row mt-4" style={{ width: "100%" }}>
        <div className="col-md-4 container d-flex flex-column align-items-center px-5">
        <Profile onUpdateProfile={onUpdateProfile}></Profile>
        </div>
        <div className="col-md-6 align-items-center px-2">
        <Posts></Posts>
        </div>
        <div className="col-md-2 container d-flex px-4">
        <Recipes></Recipes>
        </div>
    </div>
  );
};

export default MainPage;