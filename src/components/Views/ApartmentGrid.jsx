import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './ApartmentGrid.css'; // Responsive grid + theming
import logoImg from '../Store/logo.png'; // Fallback logo

/**
 * ApartmentGrid component (client-side filtering)
 *
 * Props:
 * - apiEndpoint: URL for fetching all apartments
 * - filters: { city, price, floor, rooms }
 *
 * Note: server uses `cityName` and `roomsNum` fields.
 * Clicking a card opens the detail view in a new tab/window.
 */
const ApartmentGrid = ({ apiEndpoint, filters = {} }) => {
  const [allApartments, setAllApartments] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all apartments once
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(apiEndpoint)
      .then(res => {
        setAllApartments(res.data);
        setApartments(res.data);
      })
      .catch(err => {
        const msg = err.response
          ? `Error ${err.response.status}: ${err.response.statusText}`
          : err.message;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [apiEndpoint]);

  // Filter client‑side
  useEffect(() => {
    let result = allApartments;

    // City
    if (filters.city) {
      const term = filters.city.trim().toLowerCase();
      result = result.filter(a =>
        typeof a.cityName === 'string' && a.cityName.toLowerCase().includes(term)
      );
    }
    // Price
    if (filters.price) {
      const max = parseFloat(filters.price);
      if (!isNaN(max)) result = result.filter(a => parseFloat(a.price) <= max);
    }
    // Floor
    if (filters.floor) {
      const f = parseInt(filters.floor, 10);
      if (!isNaN(f)) result = result.filter(a => parseInt(a.floor, 10) === f);
    }
    // Rooms
    if (filters.rooms) {
      const r = parseInt(filters.rooms, 10);
      if (!isNaN(r)) result = result.filter(a => parseInt(a.roomsNum, 10) === r);
    }

    setApartments(result);
  }, [filters, allApartments]);

  if (loading) return <p className="apartment-loading">Loading apartments...</p>;
  if (error)   return <p className="apartment-error">Error: {error}</p>;

  return (
    <div className="apartment-grid">
      {apartments.map(({ id, imageUrl, cityName, price, floor, roomsNum }) => (
        <a
          key={id}
          href={`/apartments/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="apartment-card-link"
        >
          <div className="apartment-card">
            <img
              src={imageUrl || logoImg}
              alt={imageUrl ? `Apartment in ${cityName}` : 'Logo'}
              className="apartment-img"
              onError={e => { e.target.onerror = null; e.target.src = logoImg; }}
            />
            <div className="apartment-details">
              <p className="apartment-info"><strong>City:</strong> {cityName || 'N/A'}</p>
              <p className="apartment-info"><strong>Price:</strong> ${price}</p>
              <p className="apartment-info"><strong>Floor:</strong> {floor}</p>
              <p className="apartment-info"><strong>Rooms:</strong> {roomsNum}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

ApartmentGrid.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    city: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    floor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

export default ApartmentGrid;


