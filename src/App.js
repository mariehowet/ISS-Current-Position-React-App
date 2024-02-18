import Title from "./components/Title";
import SunExposure from "./components/SunExposure";
import Map from "./components/Map";

function App() {
  return (
      <div className=" w-screen h-screen bg-gradient-to-r from-indigo-900 to-pink-900">
          <div className="p-4">
              <Title/>
              <div className="flex">
                  <SunExposure />
                  <Map/>
              </div>
          </div>
      </div>

  )
}

export default App;
