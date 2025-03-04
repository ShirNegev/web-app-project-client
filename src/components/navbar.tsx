import React from "react";
import logo from "../assets/logo.svg";

const Header: React.FC = () => {
    return (
      <header className="d-flex justify-content-between align-items-center p-3 white border-bottom w-100" style={{ backgroundColor: "white"}}>
        <div className="d-flex align-items-center">
          <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
          <h4 className="mb-0">FoodieBook</h4>
        </div>
        <div>
          <i className="bi bi-bell fs-4"></i>
        </div>
      </header>
    );
  };
  
  export default Header;