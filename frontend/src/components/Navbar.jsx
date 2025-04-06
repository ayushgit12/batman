import React, { useState, useEffect } from "react";
import {
  LineChart,
  LogIn,
  NewspaperIcon,
  UserPlus,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Columns2,
  FileBarChart,
  IndianRupee,
  Calculator,
  UserRound, // Added UserRound icon for Accounts
} from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(localStorage.getItem("token") ? true : false);
    };

    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const logoVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const linkVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hover: {
      scale: 1.05,
      color: "#3b82f6",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <motion.nav
      className="bg-white shadow-md sticky top-0 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={() => (window.location.href = "/")}
              variants={logoVariants}
              whileHover="hover"
            >
              <LineChart className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                InvestSmart
              </span>
            </motion.div>
          </div>
          {isAuthenticated && (
            <motion.div
              className="flex items-center space-x-4"
              variants={linkVariants}
              initial="initial"
              animate="animate"
            >
              <motion.button
                onClick={() => (window.location.href = "/appdetails")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <UserRound className="w-5 h-5 mr-1" />{" "}
                {/* Changed to UserRound */}
                Accounts {/* Changed "Home" to "Accounts" */}
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/news")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <NewspaperIcon className="w-5 h-5 mr-1" />
                Stock News
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/buysell")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <IndianRupee className="w-5 h-5 mr-1" />
                Buy/Sell
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/compare")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <Columns2 className="w-5 h-5 mr-1" />
                Compare
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/papertrading")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <FileBarChart className="w-5 h-5 mr-1" />
                Paper Trading
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/comparisonchart")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <BarChart3 className="w-5 h-5 mr-1" />
                Comparison Chart
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <BarChart3 className="w-5 h-5 mr-1" />
                Portfolio
              </motion.button>
              <motion.button
                onClick={() => (window.location.href = "/stockanalysis")}
                className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                variants={itemVariants}
                whileHover="hover"
              >
                <Calculator className="w-5 h-5 mr-1" />
                Stock Analysis
              </motion.button>
            </motion.div>
          )}
          {!isAuthenticated && (
            <motion.div className="flex items-center space-x-4">
              {onLoginClick && (
                <motion.button
                  onClick={onLoginClick}
                  className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <LogIn className="w-5 h-5 mr-1" />
                  Log In
                </motion.button>
              )}
              {onRegisterClick && (
                <motion.button
                  onClick={onRegisterClick}
                  className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer font-medium transition duration-300 ease-in-out"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <UserPlus className="w-5 h-5 mr-1" />
                  Sign Up
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
