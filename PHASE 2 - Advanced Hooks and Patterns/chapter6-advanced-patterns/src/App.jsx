import CreateComponent from "./advanced-patterns/01-custom-hook/02-basic-custom-hook";

const App = () => {
  return (
    <div>
      <h1 className="text-center">Advanced React Patterns</h1>

      {/* Custom Hooks Creation */}
      <div>
        <h2>Custom Hooks Creation</h2>

        {/* Basic Custom Hook Example */}
        <h3 className="mt-4">Basic Custom Hook Example</h3>
        <CreateComponent />
      </div>
    </div>
  );
};

export default App;
