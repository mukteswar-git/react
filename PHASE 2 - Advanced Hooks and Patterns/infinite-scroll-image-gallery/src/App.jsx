import { useCallback } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";

function App() {
  const fetchImage = useCallback(async(page) => {
    const res = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=10`
    );
    return res.json();
  }, []);

  const { data: images, loading, loadMore } = useInfiniteScroll(fetchImage);

  return (
    <div>
      <h1 className="text-4xl font-bold my-4">Image Gallery</h1>

      {/* Image Grid */}
      <div className="flex flex-wrap gap-4">
        {images.map(img => (
        <img 
          key={img.id}
          src={img.download_url}
          alt={img.author}
          width="200"
          className="rounded-2xl"
        />
      ))}
      </div>

      {/* Pagination Button */}
      <button 
        onClick={loadMore}
        disabled={loading} // Prevent multiple clicks while load
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  )
}

export default App
