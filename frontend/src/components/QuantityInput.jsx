function QuantityInput({
  label,
  value,
  unit,
  onChange,
  onUnitChange,
  name,
  placeholder = "Enter quantity",
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex w-full">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-w-0 flex-1 border border-gray-300 rounded-l-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
        />
        <select
          value={unit}
          onChange={onUnitChange}
          className="shrink-0 w-[72px] border border-l-0 border-gray-300 rounded-r-lg px-2 text-sm text-gray-600 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Kg">Kg</option>
          <option value="Boxes">Boxes</option>
          <option value="Vials">Vials</option>
          <option value="Units">Units</option>
          <option value="L">L</option>
        </select>
      </div>
    </div>
  );
}

export default QuantityInput;
