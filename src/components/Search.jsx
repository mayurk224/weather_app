import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 lg:mt-14 space-y-8 w-full">
      <div className="">
        <h1 className="bricolage-grotesque text-white text-4xl font-bold lg:text-5xl">
          How's the Sky looking today?
        </h1>
      </div>
      <div className="lg:flex lg:space-x-4 space-y-4 lg:space-y-0 items-start justify-center h-full w-full sm:w-md">
        <div className="">
          <div className="relative lg:w-md">
            <input
              type="text"
              className="w-full py-3 pl-14 rounded-lg outline-none text-white border bg-[#272541ff] hover:bg-[#302e4b]"
              placeholder="Search for a city ..."
            />
            <img
              src="src/assets/icon-search.svg"
              alt=""
              className="absolute left-5 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <div className="w-sm lg:w-md text-left space-y-2 bg-[#272541ff] p-3 rounded-lg mt-3 absolute hidden">
            {/* <ul>
              <li className="cityItem hover:bg-[#312f4bff] p-2 rounded-lg">
                <a href="#" className="text-white">
                  New York
                </a>
              </li>
            </ul> */}
            {/* <div className="searchProgress flex items-center space-x-2 text-gray-400 p-1">
            <img
              src="src/assets/icon-loading.svg"
              alt=""
              className="w-4 h-4 animate-spin"
            />
            <h3>Search in progress</h3>
          </div> */}
            <div className="noResult p-1">
              <h3 className="text-gray-400 text-center">
                No search results found !
              </h3>
            </div>
          </div>
        </div>
        <button className="bg-[#4455daff] hover:bg-[#2d1c9cff] text-white rounded-lg px-4 py-3 w-full">
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
