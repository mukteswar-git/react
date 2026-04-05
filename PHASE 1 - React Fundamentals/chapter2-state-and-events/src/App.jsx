// 2. useState Hook Deep Dive
import BasicSyntaxCounter from "./State and Events/02-usestate-hook-deep-dive/01-basic-syntax"

const App = () => {
  return (
    <div className="bg-gray-950">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        React State & Events
      </h1>

      {/* 2. useState Hook Deep Dive */}
      <h2 className="text-xl sm:text-2xl text-gray-50 font-semibold mt-6 mb-3">
        2. useState Hook Deep Dive
      </h2>

      <BasicSyntaxCounter />
    </div>
  )
}

export default App
