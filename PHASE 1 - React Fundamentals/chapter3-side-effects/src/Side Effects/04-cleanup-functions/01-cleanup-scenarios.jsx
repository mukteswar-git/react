/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
// Common Cleanup Scenarios

import { useEffect, useState } from "react";

// 1. Timers and Intervals

  function Timer() {
    const [second, setSeconds] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);

      // Cleanup: clear interval when component unmounts
      return () => {
        clearInterval(interval);
      }
    }, []);

    return <div>Seconds: {second}</div>
  }

// 2. Event Listener

  function MouseTracker() {
    const [position, setPostion] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const handleMouseMove = (e) => {
        setPostion({ x: e.clientX, y: e.clientY });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Cleanup: remove event listener
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    return <div>Mouse: {position.x}, {position.y}</div>
  }

// 3. Subsicriptions

  function ChatRoom({ roomId }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const subscription = chatAPI.subscribe(roomId, (message) => {
        setMessages(msgs => [...msgs, message]);
      });

      // Cleanup: unsubscribe when roomId changes or unmount
      return () => {
        subscription.unsubscribe();
      };
    }, [roomId]);

    return <div>{/* Display message */}</div>;
  }

// 4. Async Operations (AbortController)

  function UserData({ userId }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const controller = new AbortController();

      fetch(`/api/users/${userId}`, {
        signal: controller.signal
      })
        .then(res => res.json())
        .then(setUser)
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err);
          }
        });

      // Cleanup: abort fetch if component unmounts or userId changes
      return () => {
        controller.abort();
      };
    }, [userId]);

    if (error) return <div>Error: {error.message}</div>;
    return <div>{user?.name || 'Loading...'}</div>;
  }