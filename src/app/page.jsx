"use client";

import React from "react";
import CategoryList from "./components/CategoryList";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/landing-vid.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content-container">
          <div className="hero-content">
            <p>
              <b>Latest in Trends</b>
            </p>
            <h2>
              Discover Our <span>Wide Collection</span>
            </h2>
            <p>
              Bringing you the finest luxury products to match your perfect
              style.
            </p>
            <button className="btn">Shop Now</button>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="categories">
        <h3>Browse Categories</h3>
        <CategoryList />
      </section>
    </div>
  );
};

export default LandingPage;
