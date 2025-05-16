import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-black text-white p-6 space-y-4">
    <Link to="/" className="block">Dashboard</Link>
    <Link to="/portfolio" className="block">Portfolio</Link>
    <Link to="/admin" className="block">Admin</Link>
    <Link to="/login" className="block">Login</Link>
    <Link to="/signup" className="block">Signup</Link>
  </div>
);

export default Sidebar;
