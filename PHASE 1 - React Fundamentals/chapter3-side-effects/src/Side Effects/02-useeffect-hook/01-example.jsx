// Example 1: Updating Document Title

import { useEffect, useState } from "react"

function PageTitle() {
  const [title, setTitle] = useState('Home');

  useEffect(() =>{
    document.title = `My App - ${title}`
  }, [title]);

  return (
    <div className="mt-4 ml-4">
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title"
        className="border rounded-xs px-2"
      />
    </div>
  );
}

export default PageTitle;