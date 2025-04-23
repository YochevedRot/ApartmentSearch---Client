import React, { useState } from 'react';
import TopBar from './TopBar';
import ApartmentGrid from './ApartmentGrid';
import PersonalArea from './PersonalArea';
/**
 * ApartmentSearchPage ties TopBar and ApartmentGrid together.
 * - TopBar emits search filters via onSearch
 * - ApartmentGrid receives those filters and fetches matching apartments
 */
const ApartmentSearchPage = () => {
  const [filters, setFilters] = useState({
    city: '',
    price: '',
    floor: '',
    rooms: ''
  });

  const apiEndpoint = "http://localhost:5031/api/Appartment";

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  const handlePersonalArea = () => {
    // Navigate to personal area, e.g.:
    // history.push('/personal');
    console.log('Go to personal area');
    <PersonalArea/>
  };

  return (
    <div>
      {/* Fixed TopBar */}
      <TopBar onSearch={handleSearch} onPersonalArea={handlePersonalArea} />

      {/* Ensure content sits below TopBar */}
      <div style={{ paddingTop: '80px' }}>
        <ApartmentGrid apiEndpoint={apiEndpoint} filters={filters} />
      </div>
    </div>
  );
};

export default ApartmentSearchPage;
