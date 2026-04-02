import Layout from "./Layout"
import Product from "./Core Concepts/1 - Component Composition/Product"
import Greeting from "./Core Concepts/2 - Props and Prop Drilling/1 - Basic Prop"

const App = () => {
  return (
    <Layout>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
        React Core Concept
      </h1>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        Component Composition
      </h2>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Product />
        <Product />
        <Product />
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3">
        Basic Prop Usage
      </h2>

      {/* Better spacing */}
      <div className="space-y-2">
        <Greeting name="Mukteswar"/>
        <Greeting name="Alice"/>
        <Greeting name="Bob"/>
      </div>

    </Layout>
  )
}

export default App