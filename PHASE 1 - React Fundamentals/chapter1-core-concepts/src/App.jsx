import Layout from "./Layout"
import Product from "./Core Concepts/1 - Component Composition/Product"
import Greeting from "./Core Concepts/2 - Props and Prop Drilling/1 - Basic Prop"
import Greetings from "./Core Concepts/2 - Props and Prop Drilling/2 - Props Destructuring"
import PropsExample from "./Core Concepts/2 - Props and Prop Drilling/3 - Props Types"
import DefaultProps from "./Core Concepts/2 - Props and Prop Drilling/4 - Default Props"
import ChildrenProp from "./Core Concepts/2 - Props and Prop Drilling/5 - Children Prop"
import ProductList from "./Core Concepts/2 - Props and Prop Drilling/6 - Practical Props 2"

const App = () => {
  return (
    <Layout>

      {/* React core Concept */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-gray-50">
        React Core Concept
      </h1>

      {/* 4. Components (Functional Components) */}
      <h2 className="text-xl sm:text-2xl text-gray-50 font-semibold mt-6 mb-3">
        4. Components (Functional Components)
      </h2>

      {/* Component Composition */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Component Composition
      </h3>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Product />
        <Product />
        <Product />
      </div>

      {/* 5. Props and Prop Drilling */}
      <h2 className="text-xl sm:text-2xl text-gray-50 font-semibold mt-6 mb-3">
        5. Props and Prop Drilling
      </h2>

      {/* Basic Prop Usage */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Basic Prop Usage
      </h3>

      <div className="space-y-2">
        <Greeting name="Mukteswar"/>
        <Greeting name="Alice"/>
        <Greeting name="Bob"/>
      </div>

      {/* Props Destructuring (Recommended) */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Props Destructuring
      </h3>

      <Greetings name={"Mukteswar"} age={24}/>

      {/* Props Types */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Props Types
      </h3>

      <PropsExample
        text="Hello"
        number={42}
        boolean={true}
        array={[1, 2, 3]}
        object={{ city: 'NYC', country: 'USA'}}
        func={() => alert('Clicked')}
      />

      {/* Default Props */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Default Props
      </h3>

      <DefaultProps />
      <DefaultProps name="Mukti"/>
      <DefaultProps name="Mukti" age={24}/>

      {/* Children Prop */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Children Prop
      </h3>

      <ChildrenProp>
        <h2 className="font-bold text-center mb-4">Titile</h2>
        <p className="text-center">This is the content inside the card</p>
      </ChildrenProp>

      {/* Practical Props Example */}
      <h3 className="text-lg sm:text-xl text-gray-50 font-medium mt-6 mb-3">
        Practical Props Example
      </h3>

      <ProductList />
    </Layout>
  )
}

export default App