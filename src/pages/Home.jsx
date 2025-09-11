import ApiError from "../components/ApiError";
import DailyForecast from "../components/DailyForecast";
import HeroBlock from "../components/HeroBlock";
import HourlyForecast from "../components/HourlyForecast";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

const Home = () => {
  const sampleData = {
    Tuesday: [
      { time: "3 PM", icon: "rain", temp: 20 },
      { time: "4 PM", icon: "partly_cloudy", temp: 20 },
    ],
  };
  return (
    <div>
      <div className="lg:px-20 lg:py-6 p-4">
        <Navbar />
        {/* <ApiError /> */}
        <Search />
        <div className="lg:mt-10 mt-8 lg:flex lg:space-x-5">
          <div className="">
            <HeroBlock />
            <DailyForecast />
          </div>
          <HourlyForecast data={sampleData} />
        </div>
      </div>
    </div>
  );
};

export default Home;
