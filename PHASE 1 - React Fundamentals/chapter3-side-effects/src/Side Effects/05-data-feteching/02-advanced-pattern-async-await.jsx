// Advanced Pattern with Async/Await

import { useEffect, useState } from "react";

function Posts({ userId }) {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Can't make useEffect callback async directly
    // So we define an async function inside
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}/posts`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Posts by User {userId}</h2>
      {posts.map(post => (
        <article>
          <h3>{post.title}</h3>
            <p>{post.body}</p>
        </article>
      ))}
    </div>
  )

}

export default Posts;