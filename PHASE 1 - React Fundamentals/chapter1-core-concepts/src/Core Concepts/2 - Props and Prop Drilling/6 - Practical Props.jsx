// Practical Props Example
function ProductCard({ image, name, price, inStock, onAddtoCart }) {
  return (
    <div className="w-full max-w-xs p-4 sm:p-5 border-2 mb-8 border-gray-600 rounded-2xl bg-gray-800 shadow-sm hover:shadow-md transition">
      <img src={image} alt={name} className="h-20" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2 text-center">{name}</h3>
      <p className="text-base sm:text-lg text-blue-600 font-bold mb-2">${price}</p>
      <p className={`mb-4 font-medium ${
        inStock ? 'text-green-600' : 'text-red-600'
      }`}>
        {inStock ? 'Available' : 'Sold Out'}
      </p>
      <button
        onClick={onAddtoCart}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition"
        disabled={!inStock}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard