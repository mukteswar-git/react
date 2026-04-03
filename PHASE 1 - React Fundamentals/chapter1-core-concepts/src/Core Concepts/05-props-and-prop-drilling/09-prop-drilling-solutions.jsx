// Prop Drilling Solutions

import Layout from "../../Layout";

// Solution 1: Component Composition
function App() {
  const user = { name: 'Mukti' };

  return (
    <Layout>
      <Navbar>
        <UserProfile user={user} /> {/* Direct! */}
      </Navbar>
    </Layout>
  )
}

export default App;

// Solution 2: Context API 
// Solution 3: State Management