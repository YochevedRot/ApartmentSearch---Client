// ApartmentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from './TopBar';
import ImageCarousel from './ImageCarousel';
import ApartmentInfoList from './ApartmentInfoList';
import './ApartmentDetailPage.css';
import logoImg from '../Store/logo.png';

const ApartmentDetailPage = () => {
  const id = window.location.pathname.split('/').pop();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and increment seen
  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5031/api/appartment/${id}`)
      .then(res => {
        const apt = res.data;
        setData(apt);
        return axios.put(
          `http://localhost:5031/api/appartment/${id}`,
          { ...apt, seen: (apt.seen ?? 0) + 1 },
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="detail-loading">Loading...</p>;
  if (error) return <p className="detail-error">{error}</p>;
  if (!data) return <p className="detail-error">Not found.</p>;

  return (
    <>
      <TopBar onSearch={() => window.location.href = '/'} onPersonalArea={() => window.location.href = '/personal'} />
      <div className="detail-page">
        <ImageCarousel images={data.imageUrls?.length ? data.imageUrls : [data.imageUrl || logoImg]} />
        <ApartmentInfoList details={{
          'City Name': data.cityName,
          'Street': `${data.street} ${data.streetNum}`,
          'Floor': data.floor,
          'Rooms': data.roomsNum,
          'Size': `${data.size} m²`,  
          'Price': `$${Number(data.price).toLocaleString()}`,
          'Title': data.title,
          'Description': data.description
        }} />
      </div>
    </>
  );
};

export default ApartmentDetailPage;
