import ParentComponent from "./performance-hooks/02-usecallback-hook/01-basic-example";
import TodoList from "./performance-hooks/02-usecallback-hook/03-real-world-example";

const App = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        React Performance Hooks
      </h1>

      {/* 2. useCallback Hook */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        2. useCallback Hook
      </h2>
      <ParentComponent />

      {/* Real-World Example: Event Handlers */}
      <h3 className="text-lg sm:text-xl font-medium mt-4 ml-4">
        Real-World Example: Event Handlers
      </h3>
      <TodoList />
    </div>
  );
};

export default App;
