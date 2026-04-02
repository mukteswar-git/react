function Product() {
  const product = {
    name: 'Laptop',
    price: 999,
    image: 'laptop.jpb',
    inStock: true
  };

  return (
    <div className="w-full max-w-xs p-4 sm:p-5 border rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition">
  
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
        {product.name}
      </h3>

      <p className="text-base sm:text-lg text-blue-600 font-bold mb-2">
        ${product.price}
      </p>

      <p className={`mb-4 font-medium ${
        product.inStock ? 'text-green-600' : 'text-red-600'
      }`}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </p>

      <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition">
        Add to Cart
      </button>

    </div>
  );
}

export default Product;