/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// Mistake 5: Using Async Effect Directly

import { useEffect } from "react";

// ❌ WRONG - useEffect cannot be async 
function BadComponent() {
  useEffect(async () => {
    const data = await fetchData();
    // This doesn't work!
  }, []);
}

// ✅ CORRECT - Define async function inside
function GoodComponent() {
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchData();
      setData(data);
    };

    loadData();
  }, []);
}