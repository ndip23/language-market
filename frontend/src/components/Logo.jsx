import React from 'react';
import logoImg from '../assets/logo.png'; // 🚨 Make sure the filename matches!

const Logo = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={logoImg} 
        alt="LangConnect Logo" 
        className="h-full w-auto object-contain transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      />
    </div>
  );
};

export default Logo;