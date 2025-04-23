// TopBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';              // your AuthContext hook
import PropTypes from 'prop-types';
import './TopBar.css';
import logoImg from '../Store/logo.png';      // your logo path

const TopBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    city: '',
    price: '',
    floor: '',
    rooms: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
    navigate('/');  // stay on search page (or remove if you want to remain on current)
  };

  const handlePersonal = () => {
    if (user) {
      navigate('/personal');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="top-bar">
      <img src={logoImg} alt="Logo" className="top-bar-logo" />
      <div className="top-bar-search">
        <input
          name="city"
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Max Price"
          value={filters.price}
          onChange={handleChange}
        />
        <input
          name="floor"
          type="number"
          placeholder="Floor"
          value={filters.floor}
          onChange={handleChange}
        />
        <input
          name="rooms"
          type="number"
          placeholder="Rooms"
          value={filters.rooms}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <button className="top-bar-personal" onClick={handlePersonal}>
        Personal Area
      </button>
    </header>
  );
};

TopBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default TopBar;
