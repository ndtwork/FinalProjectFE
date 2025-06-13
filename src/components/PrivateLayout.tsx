import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function PrivateLayout() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
