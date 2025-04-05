import React, { useState, useEffect } from 'react';
import { LineChart, LogIn, UserPlus, LogOut, LayoutDashboard, BarChart3, Columns2, FileBarChart } from 'lucide-react';

const Navbar = ({ onLoginClick, onRegisterClick }) => {

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <LineChart className="w-8 h-8 text-blue-600" />
            <span onClick={() => window.location.href = "/"} className="ml-2 cursor-pointer text-xl font-bold text-gray-900">
              InvestSmart
            </span>
          </div>
          {localStorage.getItem("token") && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = "/appdetails"}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <LayoutDashboard className="w-5 h-5 mr-1" />
                Dashboard
              </button>
              <button
                onClick={() => window.location.href = "/compare"}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <Columns2 className="w-5 h-5 mr-1" />
                Compare
              </button>
               <button
                onClick={() => window.location.href = "/papertrading"}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <FileBarChart className="w-5 h-5 mr-1" />
                Paper Trading
              </button>
              <button
                onClick={() => window.location.href = "/comparisonchart"}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 mr-1" />
                Comparison Chart
              </button>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 mr-1" />
                Angel One
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;