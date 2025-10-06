import { RefreshCcw } from "lucide-react";

const ApiError = () => {
  return (
    <div role="alert" aria-live="assertive">
      <div className="flex items-center justify-center flex-col space-y-4 h-[70vh] text-center">
        <div className="">
          <img
            src="src/assets/icon-error.svg"
            alt="Error icon"
            className="w-10 h-10 mx-auto icon-auto"
          />
        </div>
        <div className="">
          <h1 className="text-4xl font-semibold text-primary">
            Something went wrong
          </h1>
          <p className="text-secondary mt-2 lg:w-md">
            We couldn't connect to server(API error). Please try again in a few
            moments
          </p>
        </div>
        <div className="">
          <button
            className="flex items-center bg-button hover:bg-button-hover text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => window.location.reload()}
            aria-label="Retry loading weather data"
          >
            <RefreshCcw className="w-4 h-4 mr-2" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiError;
