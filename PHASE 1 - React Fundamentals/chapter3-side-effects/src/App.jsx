// 2. useEffect Hook
import PageTitle from "./Side Effects/02-useeffect-hook/01-example";
import UseTracker from "./Side Effects/02-useeffect-hook/02-example";
import DigitalClock from "./Side Effects/07-excercise/01-digital-clock";
import WindowSize from "./Side Effects/07-excercise/02-window-size-tracker";

function App() {
  return (
    <div>
      <p>2. useEffect Hook</p>
      <PageTitle />
      <UseTracker />

      <DigitalClock />
      <WindowSize />
    </div>
  )
}

export default App;