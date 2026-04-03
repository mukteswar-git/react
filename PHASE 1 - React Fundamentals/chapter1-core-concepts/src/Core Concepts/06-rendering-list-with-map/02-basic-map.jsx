// Basic .map() Syntax

function NameList() {
  const names = ['Alice', 'Bob', 'Charlie'];

  return (
    <ul className="text-gray-50">
      {names.map((name) => (
        <li>{name}</li>
      ))}
    </ul>
  );
}

export default NameList;