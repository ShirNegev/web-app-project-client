import React from 'react';
import logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import userService from '../services/user-service';

const Header: React.FC = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    const { request } = userService.logout();
    request.then(() => {
      setUser(null);
      navigate('/login');
    });
  };

  return (
    <header
      className="d-flex justify-content-between align-items-center p-2 white border-bottom w-100 sticky-top"
      style={{ backgroundColor: 'white' }}
      role="navigation"
    >
      <div className="d-flex align-items-center ms-1" style={{ cursor: 'pointer' }} onClick={() => user && navigate('/')}>
        <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
        <h4 className="mb-0 text-black fw-light">
          FoodieBook
        </h4>
      </div>
      {user && (
        <div className="flex-shrink-0 dropdown">
          <img
            src={user.imageUrl}
            className="rounded-circle me-2"
            width="50"
            height="50"
            data-bs-toggle="dropdown"
            role="button"
            style={{ objectFit: 'cover' }}
          />
          <ul className="dropdown-menu shadow">
            <li>
              <button className="dropdown-item text-danger" onClick={() => handleLogout()}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
