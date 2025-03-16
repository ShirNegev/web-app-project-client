import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/navbar'
import LoginPage from './pages/login-page'
import MainPage from './pages/main-page'
import RegisterPage from "./pages/register-page";
import { useEffect, useState } from "react";
import userService from './services/user-service';
import User from "./interfaces/user";
import { useUserStore } from "./store/useUserStore";
import ProtectedRoute from "./components/protectedRoute";
import IfLoggedRoute from "./components/ifLoggedRoute";
import loader from "./assets/loader.svg";


const App: React.FC = ()  =>{
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading ]= useState(false);

useEffect(() => {
  if (user) return;

  setIsLoading(true);

  const { request, abort } = userService.getUserInfo();
  request.then((response) => {
    console.log(response);
    const user: User = {
      email: response.data.email,
      fullName: response.data.fullName,
      imageUrl: response.data.imageUrl
    };
    setUser(user);
    setIsLoading(false);
  }).catch((error: any) => {
    console.error(error);
    setIsLoading(false);
  });

  return () => { abort(); };
},[]);

  return (
    <Router>
      <Navbar></Navbar>
      {isLoading ? 
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
        <img className="spinner" src={loader} />
      </div> :
      <Routes>
        <Route path="/" element={<ProtectedRoute><MainPage></MainPage></ProtectedRoute>}></Route>
        <Route path="/login" element={<IfLoggedRoute><LoginPage></LoginPage></IfLoggedRoute>}></Route>
        <Route path="/register" element={<IfLoggedRoute><RegisterPage></RegisterPage></IfLoggedRoute>}></Route>
       </Routes>}
    </Router>
  )
}

export default App
