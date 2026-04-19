/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Strategy 4: Lazy Loading

import React, { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const HeavyTable = lazy(() => import('./HeavyTable'));

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab} />
      <Suspense fallback={<div>Loading...</div>}>
        {activeTab === 'chart' && <HeavyChart />}
        {activeTab === 'table' && <HeavyTable />}
      </Suspense>
    </div>
  );
}