// Advanced Example: Accordion Component

import { createContext, useContext, useState } from "react";

const AccordionContext = createContext();

function Accordion({ children, defaultIndex = null, allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState(
    defaultIndex !== null ? [defaultIndex] : [],
  );

  const toggleItem = (index) => {
    setOpenIndexes((prev) => {
      if (allowMultiple) {
        return prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index];
      } else {
        return prev.includes(index) ? [] : [index];
      }
    });
  };

  const isOpen = (index) => openIndexes.includes(index);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = function AccordionItem({ children, index }) {
  return (
    <div className="accordion-item">
      {typeof children === "function" ? children(index) : children}
    </div>
  );
};

Accordion.Header = function AccordionHeader({ children, index }) {
  const { toggleItem, isOpen } = useContext(AccordionContext);

  return (
    <div
      className="accordion-header"
      onClick={() => toggleItem(index)}
      style={{
        cursor: "pointer",
        padding: "10px",
        background: isOpen(index) ? "#e0e0e0" : "#f5f5f5",
        borderBottom: "1px solid #ccc",
      }}
    >
      {children}
      <span>{isOpen(index) ? "▲" : "▼"}</span>
    </div>
  );
};

Accordion.Panel = function AccordionPanel({ children, index }) {
  const { isOpen } = useContext(AccordionContext);

  if (!isOpen(index)) return null;

  return (
    <div className="accordion-panel" style={{ padding: "15px" }}>
      {children}
    </div>
  );
};

// Usage
function FAQPage() {
  return (
    <Accordion defaultIndex={0} allowMultiple={false}>
      <Accordion.Item index={0}>
        <Accordion.Header index={0}>What is React?</Accordion.Header>
        <Accordion.Panel index={0}>
          React is a JavaScript library for building user interfaces.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item index={1}>
        <Accordion.Header index={1}>
          Hooks are functions that let you use state and other React features.
        </Accordion.Header>
      </Accordion.Item>

      <Accordion.Item index={2}>
        <Accordion.Header index={2}>What is JSX?</Accordion.Header>
        <Accordion.Panel index={2}>
          JSX is a syntax extension for JavaScript that looks similar to HTML.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default FAQPage;
