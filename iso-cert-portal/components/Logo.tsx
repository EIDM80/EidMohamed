
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 48, color = "#0a1128" }) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main Head Silhouette */}
        <path
          d="M50 5C35 5 25 15 25 30C25 35 27 40 30 45C33 50 35 55 35 60C35 70 40 85 55 95C75 95 85 85 85 60C85 30 75 5 50 5Z"
          fill={color}
        />
        
        {/* Pixelated / Digital Effect Blocks (Left Side) */}
        <rect x="15" y="25" width="8" height="8" fill={color} />
        <rect x="5" y="35" width="6" height="6" fill={color} />
        <rect x="18" y="40" width="10" height="10" fill={color} />
        <rect x="10" y="50" width="7" height="7" fill={color} />
        <rect x="22" y="55" width="5" height="5" fill={color} />
        <rect x="8" y="65" width="9" height="9" fill={color} />
        <rect x="18" y="75" width="6" height="6" fill={color} />
        
        {/* Connecting Lines */}
        <path d="M23 29L15 29" stroke={color} strokeWidth="1.5" />
        <path d="M25 38L18 38" stroke={color} strokeWidth="1.5" />
        <path d="M28 45L23 45" stroke={color} strokeWidth="1.5" />
        <path d="M35 52L28 52" stroke={color} strokeWidth="1.5" />
        <path d="M35 65L27 65" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
};

export default Logo;
