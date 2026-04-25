import { useEffect, useState } from "react"

function App() {
  // State: holds all fetched images
  const [images, setImages] = useState([]);

  // Current page for pagination
  const [page, setPage] = useState(1);

  // Loading state to control UI + prevent spam clicks
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      
      try {
        const res = await fetch(
          `https://picsum.photos/v2/list?page=${page}&limit=10`
        );
        const data = await res.json();

        // Prevent duplicate images (Strict Mode runs twice)
        setImages(prev => {
          // Combine old + new images
          const combined = [...prev, ...data];

          // Remove duplicates based on unique image id
          const unique = combined.filter(
            (img, index, self) => 
              index === self.findIndex((i) => i.id === img.id)
          );

          return unique;
        });
      } catch (err) {
        console.error("Error fetching images:", err)
      } finally {
        setLoading(false)
      }
    };

    fetchImages(); // Only runs when page changes
  }, [page])

  // Debug log 
  console.log("Fetching page:", page);

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
        onClick={() => setPage(p => p + 1)}
        disabled={loading} // Prevent multiple clicks while load
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  )
}

export default App
