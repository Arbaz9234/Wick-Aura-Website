import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { Package } from "lucide-react";

export default function ListProducts({ token }) {
  const [list, setList] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const confirmDelete = (id) => {
    if (pendingDelete) {
      removeProduct(id);
      setPendingDelete(null);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (list.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            No products yet
          </h2>
          <p className="text-gray-600">
            Products you add will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        All Products
      </h3>

      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] items-center px-5 py-3.5 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-200">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Scent</span>
          <span>Colors</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 px-5 py-4 text-sm ${
              index < list.length - 1 ? "border-b border-gray-100" : ""
            }`}
            key={item._id}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src={item.image[0]}
                alt={item.name}
              />
            </div>
            <p className="font-medium text-gray-800 truncate">{item.name}</p>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-gray-600">{item.subCategory}</p>
            <div className="flex flex-wrap gap-1">
              {item.colors?.map((color) => (
                <span
                  key={color}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md"
                >
                  {color}
                </span>
              ))}
            </div>
            <p className="font-semibold text-gray-800">
              {currency}
              {item.price}
            </p>
            <button
              onClick={() =>
                setPendingDelete({
                  itemId: item._id,
                  productName: item.name,
                })
              }
              className="justify-self-center w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <assets.TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Product Count */}
      <p className="text-xs text-gray-500 mt-3 px-1">
        {list.length} {list.length === 1 ? "product" : "products"}
      </p>

      {/* Delete Confirmation Dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <assets.AlertIcon />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Remove Product?
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  <span className="font-medium text-gray-700">
                    {pendingDelete.productName}
                  </span>{" "}
                  will be permanently removed from products.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(pendingDelete.itemId)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
