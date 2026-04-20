import { useRef } from "react";

function ScrollToSection() {
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      <button onClick={scrollToSection} className="bg-amber-900 hover:bg-amber-800 px-2 py-1 rounded mt-4 ml-4 ">Scroll to Section</button>

      <div style={{ height: "100vh" }}>{/* Spacer */}</div>

      <div ref={sectionRef} className="bg-amber-900 p-4 rounded-2xl">
        <h2>Target Section</h2>
        <p>You scrolled here!</p>
      </div>
    </div>
  );
}

export default ScrollToSection;
