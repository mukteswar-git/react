// .map() with Index

function MapNumberedList() {
  const items = ['First', 'Second', 'Third'];

  return (
    <ol className="text-gray-50">
      {items.map((item, index) => (
        <li key={index}>
          Item #{index + 1}: {item}
        </li>
      ))}
    </ol>
  );
}

export default MapNumberedList;