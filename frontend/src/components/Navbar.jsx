import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-logo-icon">
            <ShoppingBag size={22} />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">E-Commerce Store</span>
            <span className="brand-tag">VIP STORE</span>
          </div>
        </Link>

        {/* Mobile Quick Actions (Theme toggle + Cart + Hamburger) */}
        <div className="navbar-mobile-actions">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={19} className="theme-icon sun-icon" />
            ) : (
              <Moon size={19} className="theme-icon moon-icon" />
            )}
          </button>

          {/* Mobile Cart Quick Icon */}
          <Link
            to="/cart"
            className="mobile-cart-btn"
            onClick={closeMobileMenu}
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="nav-badge mobile-badge">{totalItems}</span>}
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Nav Links (Desktop + Mobile Dropdown) */}
        <nav className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
          </NavLink>

          {/* Show an "Admin Dashboard" link only if the logged-in user possesses the Admin role */}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              <ShieldCheck size={18} />
              <span>Admin Dashboard</span>
              <span className="admin-badge">Admin</span>
            </NavLink>
          )}

          {/* Desktop Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn desktop-theme-btn"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <Sun size={18} className="theme-icon sun-icon" />
                <span className="theme-label">Light</span>
              </>
            ) : (
              <>
                <Moon size={18} className="theme-icon moon-icon" />
                <span className="theme-label">Dark</span>
              </>
            )}
          </button>

          {/* User Status / Auth Links */}
          {user ? (
            <div className="nav-user-section">
              <div className="user-pill">
                <User size={15} />
                <span className="user-name-text">{user.name}</span>
                {user.role === "admin" && (
                  <span className="user-role-badge">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Logout"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Backdrop overlay for mobile menu when open */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Navbar;
