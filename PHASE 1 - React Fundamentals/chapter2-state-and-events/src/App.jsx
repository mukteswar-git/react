// 2. useState Hook Deep Dive
import BasicSyntaxCounter from "./State and Events/02-usestate-hook-deep-dive/01-basic-syntax"
// 4. Controlled vs Uncontrolled Components
import ControlledInput from "./State and Events/04-controlled-vs-uncontrolled-components/01-controlled-components"
import ControlledExample from "./State and Events/04-controlled-vs-uncontrolled-components/01-01-controlled-component-example"

const App = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        React State & Events
      </h1>

      {/* 2. useState Hook Deep Dive */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        2. useState Hook Deep Dive
      </h2>

      <BasicSyntaxCounter />

      {/* 4. Controlled vs Uncontrolled Components */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        4. Controlled vs Uncontrolled Components
      </h2>

      {/* Controlled Components */}
      <h3 className="text-lg sm:text-xl font-medium ml-4">
        Controlled Component
      </h3>

      <ControlledInput />

      <ControlledExample />
    </div>
  )
}

export default App
