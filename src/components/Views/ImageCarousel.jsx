// ImageCarousel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ImageCarousel.css';

/**
 * Simple image carousel for apartment detail.
 * Shows prev/next buttons if more than one image.
 */
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((idx) => (idx + 1) % images.length);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-image-wrapper">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />
      </div>

      {images.length > 1 && (
        <>
          <button className="carousel-btn prev" onClick={prevImage}>&lt;</button>
          <button className="carousel-btn next" onClick={nextImage}>&gt;</button>
        </>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  /** Array of image URLs to display */
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageCarousel;
