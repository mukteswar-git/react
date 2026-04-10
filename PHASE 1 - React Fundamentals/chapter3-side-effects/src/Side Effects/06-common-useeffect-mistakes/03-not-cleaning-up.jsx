/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Mistake 3: Not Cleaning Up

// ❌ WRONG - Memory leak
function BadSubscription({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = api.subscribe(userId, setData);
    // No cleanup! Subscription continues after unmount
  }, [userId]);

  return <div>{data}</div>;
}

// ✅ CORRECT
function GoodSubscription({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const subscription = api.subscribe(userId, setData);

    return () => {
      subscription.unsubscribe(); // Clean up!
    };
  }, [userId]);

  return <div>{data}</div>;
}