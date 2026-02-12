type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  [key: string]: unknown;
};

type Props = {
  product: Product;
  addToCart?: (product: Product) => void;
  buyNow?: (product: Product) => void;
};

export default function ProductCard({ product, addToCart = () => {}, buyNow = () => {} }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-gray-100 h-56 w-full overflow-hidden group">
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/300x250?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/300x250?text=No+Image";
          }}
        />
        {/* Badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
             NEW
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 h-10">
          {product.name}
        </h3>

        {/* Rating (Optional) */}
        <div className="flex items-center mb-2">
          <span className="text-yellow-500">★★★★☆</span>
          <span className="text-gray-600 text-xs ml-2">(120 reviews)</span>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && product.stock !== null && (
          <p className="text-xs mb-3">
            <span className={(product.stock as number) > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {(product.stock as number) > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </p>
        )}

        {/* Price Section */}
        <div className="mb-auto mb-4">
          <p className="text-2xl font-bold text-gray-900">
            ₹{product.price?.toLocaleString?.() || product.price}
          </p>
          <p className="text-xs text-gray-500 line-through">
            ₹{Math.round(product.price * 1.4)?.toLocaleString?.()}
          </p>
          <span className="text-green-600 font-bold text-xs">Save 20%</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            🛒 Add to Cart
          </button>
          <button
            onClick={() => buyNow(product)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors duration-200 text-sm"
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
