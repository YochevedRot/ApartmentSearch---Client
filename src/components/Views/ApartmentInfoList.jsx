// ApartmentInfoList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './ApartmentInfoList.css';

/**
 * Renders a list of apartment detail fields.
 * Expects a `details` object where keys are labels and values are content.
 */
const ApartmentInfoList = ({ details }) => {
  return (
    <div className="info-list-container">
      <h2>Apartment Details</h2>
      <ul className="info-list">
        {Object.entries(details).map(([label, value]) => (
          <li key={label} className="info-list-item">
            <span className="info-label">{label}:</span>{' '}
            <span className="info-value">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

ApartmentInfoList.propTypes = {
  /**
   * details: object mapping field labels to their values
   * e.g. { 'City Name': 'Beit Shemesh', 'Rooms': 3 }
   */
  details: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
};

export default ApartmentInfoList;
