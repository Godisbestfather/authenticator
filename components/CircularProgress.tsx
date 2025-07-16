
import React from 'react';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size, strokeWidth }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const progressColor = progress < (5 / 30) ? 'stroke-orange-500' : 'stroke-blue-600';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        className="stroke-gray-200 dark:stroke-gray-700"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      <circle
        className={`transition-[stroke-dashoffset] duration-1000 linear ${progressColor}`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
    </svg>
  );
};
