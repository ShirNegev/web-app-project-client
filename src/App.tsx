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

    if (window.location.pathname === "/login" || window.location.pathname === "/register") {
      window.location.href = "/";
    }
  }).catch((error: any) => {
    console.error(error);
    if((window.location.pathname === "/") && error.response.status === 401) {
      window.location.href = "/login";
    }
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
        <Route path="/" element={<MainPage></MainPage>}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
       </Routes>}
    </Router>
  )
}

export default App
