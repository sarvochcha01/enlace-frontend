import React from "react";

interface ProgressBarProps {
  progress: number;
  total: number;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  showPercentage = false,
}) => {
  const percentage = total === 0 ? 0 : Math.min((progress / total) * 100, 100);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between  items-center gap-3 w-full">
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 min-w-[3rem]  flex justify-end">
            {`${Math.round(percentage)}%`}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
