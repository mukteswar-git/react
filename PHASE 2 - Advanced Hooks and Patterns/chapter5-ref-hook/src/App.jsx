import AutoFocusInput from "./ref-hook/03-useref-for-dom-access/01-focus-management";
import ScrollToSection from "./ref-hook/03-useref-for-dom-access/02-scroll-to-element";
import MeasureElement from "./ref-hook/03-useref-for-dom-access/03-measuring-dom-elements";
import VideoPlayer from "./ref-hook/03-useref-for-dom-access/04-video-player-control";
import StateVsRef from "./ref-hook/05-ref-vs-state/01-ref-vs-state";
import Parent from "./ref-hook/07-useimperativehandle-hook/01-basic-example";

const App = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        React Ref Hooks
      </h1>

      <div>
        {/* 3. useRef for DOM Access */}
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
          3. useRef for DOM Access
        </h2>

        <div className=" ml-4">
          <h3 className="text-lg sm:text-xl font-medium">
            Example 1: Focus Management
          </h3>

          <AutoFocusInput />
        </div>

        <div className=" ml-4 mt-4">
          <h3 className="text-lg sm:text-xl font-medium">
            Example 2: Scroll to Element
          </h3>

          <ScrollToSection />
        </div>

        <div className=" ml-4 mt-4">
          <h3 className="text-lg sm:text-xl font-medium">
            Example 3: Measuring DOM Elements
          </h3>

          <MeasureElement />
        </div>

        <div className=" ml-4 mt-4">
          <h3 className="text-lg sm:text-xl font-medium">
            Example 4: Video Player Control
          </h3>

          <VideoPlayer />
        </div>
      </div>

      {/* 5. Difference Between Ref and State */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
          5. Difference Between Ref and State
        </h2>

        <StateVsRef />
      </div>

      {/* 7. useImperativeHandle Hook */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        7. useImperativeHandle Hook
      </h2>

      <Parent />
    </div>
  );
};

export default App;
