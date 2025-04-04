import React, { useState, useEffect } from 'react';
import { LineChart, LogIn, UserPlus, LogOut } from 'lucide-react';

const Navbar = ({ onLoginClick, onRegisterClick }) => {


  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <LineChart className="w-8 h-8 text-blue-600" />
            <span onClick={()=>window.location.href = "/"} className="ml-2 cursor-pointer text-xl font-bold text-gray-900">
              InvestSmart
            </span>
          </div>

         </div>
      </div>
    </nav>
  );
};

export default Navbar;