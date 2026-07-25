function ProgressBar({ percent = 0, label = "Extraction Progress" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
          {label}
        </span>
        <span className="text-xs font-semibold text-indigo-600">
          {percent}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
