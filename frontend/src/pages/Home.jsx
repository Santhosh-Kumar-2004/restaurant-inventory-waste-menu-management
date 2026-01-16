import React from "react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
import "../styles/Home.css"

function Home() {
  return (
    <div className="home-wrapper">
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">The Future of Restaurants</span>
          <h1>Modern Inventory and<br /><span>Waste Managements</span></h1>
          <p>
            The most transparent way to buy and sell high-value agricultural assets. 
            Real-time bidding, verified inventory, and secure transactions.
          </p>
          <div className="hero-btns">
            <Link to="/auctions/upcoming" className="btn-main">Browse Auctions</Link>
            <Link to="/register" className="btn-outline">Join the Community</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <h3>10k+</h3>
          <p>Verified Assets</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>$25M+</h3>
          <p>Auction Volume</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <h3>5k+</h3>
          <p>Active Bidders</p>
        </div>
      </section>

      {/* Features / Shortcut Section */}
      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Inventory Tracking</h3>
          <p>Real-time reports for admins, chefs, and staff to manage stock levels effectively.</p>
          <Link to="/inventory">View Inventory</Link>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure Bidding</h3>
          <p>Every bid is encrypted and tracked, ensuring 100% transparency for all participants.</p>
          <Link to="/auctions/upcoming">Learn More</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Live Notifications</h3>
          <p>Never miss a bid with our real-time notification system for outbids and wins.</p>
          <Link to="/login">Sign In</Link>
        </div>
      </section>
      
      <footer className="home-footer">
        <p>&copy; 2026 AgriAuction Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;