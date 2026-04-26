import React, { useState } from "react";
import { Flame, Instagram, Copy, Check } from "lucide-react";

export default function CandleShop() {
  // Replace 'your_instagram_username' with your actual Instagram username
  const instagramUsername = "wickandaura_";

  const [copiedProduct, setCopiedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Lavender Dreams",
      image:
        "https://images.unsplash.com/photo-1602874801006-526bb3cc2e1a?w=400&h=400&fit=crop",
      description: "Calming lavender scent",
    },
    {
      id: 2,
      name: "Vanilla Bliss",
      image:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop",
      description: "Sweet vanilla fragrance",
    },
    {
      id: 3,
      name: "Ocean Breeze",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
      description: "Fresh oceanic notes",
    },
    {
      id: 4,
      name: "Cinnamon Spice",
      image:
        "https://images.unsplash.com/photo-1587144031497-c4c48c2dd7bb?w=400&h=400&fit=crop",
      description: "Warm spicy aroma",
    },
    {
      id: 5,
      name: "Rose Garden",
      image:
        "https://images.unsplash.com/photo-1602874801006-526bb3cc2e1a?w=400&h=400&fit=crop",
      description: "Romantic rose essence",
    },
    {
      id: 6,
      name: "Sandalwood Zen",
      image:
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop",
      description: "Earthy sandalwood blend",
    },
  ];

  const handleProductClick = async (product) => {
    const message = `Hey, I am interested in ${product.name}`;

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(message);
      setSelectedProduct(product);
      setCopiedProduct(product.id);
      setShowModal(true);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedProduct(null), 2000);

      // Open Instagram DM after a short delay
      setTimeout(() => {
        window.open(`https://ig.me/m/${instagramUsername}`, "_blank");
      }, 5000);
    } catch (err) {
      // Fallback if clipboard fails
      setSelectedProduct(product);
      setShowModal(true);
      window.open(`https://ig.me/m/${instagramUsername}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Scented Candles
              </h1>
            </div>
            <a
              href={`https://instagram.com/${instagramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-medium">Follow Us</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Collection
          </h2>
          <p className="text-lg text-gray-600">
            Click any candle to message us on Instagram
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-white">
                    <Instagram className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Message us on Instagram
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.description}</p>
                <div className="mt-4 flex items-center text-orange-600 font-medium">
                  {copiedProduct === product.id ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      <span>Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <span>Inquire Now</span>
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Message Copied!
              </h3>
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  This message has been copied:
                </p>
                <p className="text-orange-800 font-semibold">
                  "Hey, I am interested in {selectedProduct.name}"
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Instagram is opening. Simply paste (Ctrl+V or Cmd+V) the message
                in our chat and send!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            Handcrafted with love • Follow us on Instagram for updates
          </p>
        </div>
      </footer>
    </div>
  );
}
