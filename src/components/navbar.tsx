import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    return (
      <header className="d-flex justify-content-between align-items-center p-3 white border-bottom w-100 sticky-top"
       style={{ backgroundColor: "white"}} role="navigation">
        <Link to="/">
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
          <h4 className="mb-0 text-black">FoodieBook</h4>
        </div>
        </Link>
        <div>
          <i className="bi bi-bell fs-4"></i>
        </div>
      </header>
    );
  };
  
  export default Header;