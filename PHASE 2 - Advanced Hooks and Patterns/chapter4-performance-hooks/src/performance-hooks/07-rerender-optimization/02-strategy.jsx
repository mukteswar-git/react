/* eslint-disable react-refresh/only-export-components */
// Strategy 2: Move State Down

import { useState } from "react";

// ❌ Bad - state at top level affects everything
function App() {
  const [selectedTab, setSelectedTab] = useState('home');
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Navigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <MainContent tab={selectedTab}>
        <Form data={formData} onChange={setFormData} />
      </MainContent>
    </div>
  );
}

// ✅ Good - state lives where it's used
function App2() {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <div>
      <Navigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <SidebarContainer />
      <MainContent tab={selectedTab}>
        <FormContainer />
      </MainContent>
    </div>
  )
}

function SidebarContainer() {
  const [isOpen, setIsOpen] = useState(false);
  return <Sidebar isOpen={isOpen} onToggle={setIsOpen} />;
}

function FormContainer() {
  const [formData, setFormData] = useState({});
  return <Form data={formData} onChange={setFormData} />;
}