// 3. Memoizing Object/Array References

import { useMemo, useState } from "react"

const DataComponent = ({ id }) => {
  const [count, setCount] = useState(0);

  // Without useMemo, this object is recreated every render
  const config = useMemo(() => ({
    id,
    options: {
      cache: true,
      retry: 3
    }
  }), [id]);

  return (
    <div>
      <ExpensiveChildComponent config={config} />
      <button onClick={() => setCount(count + 1)}>
        Re-render: {count}
      </button>
    </div>
  )
}

export default DataComponent