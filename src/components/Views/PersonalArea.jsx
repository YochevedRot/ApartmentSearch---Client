// PersonalArea.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import TopBar from './TopBar';
import logoImg from '../Store/logo.png';
import './PersonalArea.css';

const SECTIONS = [
  { key: 'saved', label: 'Saved Ads' },
  { key: 'posted', label: 'Your Ads' },
  { key: 'stats', label: 'Statistics' },
  { key: 'profile', label: 'Personal Details' },
  { key: 'recent', label: 'Recent Searches' }
];

/**
 * PersonalArea fetches all user-related data from a single endpoint.
 */
const PersonalArea = ({ userEndpoint }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState('saved');
  const [data, setData] = useState({
    saved: [],
    posted: [],
    stats: { totalViews: 0, similarCount: 0 },
    profile: { name: '', email: '', phone: '', debt: 0 },
    recent: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data in one call
  useEffect(() => {
    setLoading(true);
    axios.get(userEndpoint)
      .then(res => {
        const {
          savedAds,
          postedAds,
          totalViews,
          similarCount,
          name,
          email,
          phone,
          debt,
          recentSearches
        } = res.data;

        setData({
          saved: Array.isArray(savedAds) ? savedAds : [],
          posted: Array.isArray(postedAds) ? postedAds : [],
          stats: { totalViews: totalViews || 0, similarCount: similarCount || 0 },
          profile: { name: name || '', email: email || '', phone: phone || '', debt: debt || 0 },
          recent: Array.isArray(recentSearches) ? recentSearches : []
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userEndpoint]);

  const handleSearch = filters => {
    navigate('/', { state: { filters } });
  };
  const handlePersonal = () => {
    navigate('/personal');
  };

  const Empty = ({ message }) => (
    <div className="pa-empty">
      <img src={logoImg} alt="Empty" className="pa-empty-img" />
      <p>{message}</p>
    </div>
  );

  const renderSection = () => {
    if (loading) return <p className="pa-loading">Loading...</p>;
    if (error) return <p className="pa-error">Error: {error}</p>;

    switch (active) {
      case 'saved':
        return data.saved.length ? (
          <ul className="pa-list">
            {data.saved.map(a => <li key={a.id}>{a.title}</li>)}
          </ul>
        ) : <Empty message="No saved ads." />;

      case 'posted':
        return data.posted.length ? (
          <ul className="pa-list">
            {data.posted.map(a => <li key={a.id}>{a.title}</li>)}
          </ul>
        ) : <Empty message="No posted ads." />;

      case 'stats':
        return (
          <div className="pa-stats">
            <p><strong>Total Views:</strong> {data.stats.totalViews}</p>
            <p><strong>Similar Ads:</strong> {data.stats.similarCount}</p>
          </div>
        );

      case 'profile':
        return (
          <div className="pa-profile">
            <p><strong>Name:</strong> {data.profile.name}</p>
            <p><strong>Email:</strong> {data.profile.email}</p>
            <p><strong>Phone:</strong> {data.profile.phone}</p>
            <p><strong>Debt:</strong> {data.profile.debt}</p>
          </div>
        );

      case 'recent':
        return data.recent.length ? (
          <ul className="pa-list">
            {data.recent.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        ) : <Empty message="No recent searches." />;

      default:
        return null;
    }
  };

  return (
    <>
      <TopBar onSearch={handleSearch} onPersonalArea={handlePersonal} />
      <div className="pa-container">
        <aside className="pa-sidebar">
          {SECTIONS.map(s => (
            <div
              key={s.key}
              className={`pa-menu-item${active === s.key ? ' active' : ''}`}
              onClick={() => setActive(s.key)}
            >
              {s.label}
            </div>
          ))}
        </aside>
        <main className="pa-main">
          {renderSection()}
        </main>
      </div>
    </>
  );
};

PersonalArea.propTypes = {
  userEndpoint: PropTypes.string.isRequired
};

export default PersonalArea;
