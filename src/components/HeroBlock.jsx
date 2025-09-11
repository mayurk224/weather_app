const HeroBlock = () => {
  return (
    <div>
      <div
        className="w-full rounded-lg overflow-hidden bg-cover bg-center 
  h-64 sm:h-72 
  bg-[url('src/assets/bg-today-small.svg')] lg:bg-[url('src/assets/bg-today-large.svg')] 
  flex flex-col justify-center items-center gap-4 
  lg:flex-row lg:justify-between lg:items-center lg:p-10 p-5"
      >
        {/* Location + Date */}
        <div className="text-center lg:text-left">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Berlin, Germany
          </h1>
          <h3 className="text-gray-300 text-sm sm:text-base">
            Monday, 21 Feb 2024
          </h3>
        </div>

        {/* Weather Info */}
        <div className="flex items-center justify-center gap-4">
          <img
            src="src/assets/icon-sunny.webp"
            alt="Weather icon"
            className="w-32 sm:w-32 lg:w-36"
          />
          <h1 className="text-white text-6xl sm:text-6xl lg:text-7xl font-bold bricolage-grotesque italic">
            68&#176;C
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
        <div className="bg-[#312f4b] rounded-lg p-5 space-y-2">
          <h3 className="text-gray-300 text-sm">Feels like</h3>
          <h1 className="text-white text-2xl font-medium">10°C</h1>
        </div>

        <div className="bg-[#312f4b] rounded-lg p-5 space-y-2">
          <h3 className="text-gray-300 text-sm">Humidity</h3>
          <h1 className="text-white text-2xl font-medium">65%</h1>
        </div>

        <div className="bg-[#312f4b] rounded-lg p-5 space-y-2">
          <h3 className="text-gray-300 text-sm">Wind</h3>
          <h1 className="text-white text-2xl font-medium">5 km/h</h1>
        </div>

        <div className="bg-[#312f4b] rounded-lg p-5 space-y-2">
          <h3 className="text-gray-300 text-sm">Precipitation</h3>
          <h1 className="text-white text-2xl font-medium">0 mm</h1>
        </div>
      </div>
    </div>
  );
};

export default HeroBlock;
