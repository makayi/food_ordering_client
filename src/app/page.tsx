'use client';
import { useState } from "react";
import { paymentService } from "@/services/paymentService";
import { ShoppingCart, Minus, Plus, X } from 'lucide-react'; // You'll need to install lucide-react
import { redirect } from "next/navigation";


// Types for our food ordering system
interface FoodItem {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface CartItem extends FoodItem {
  quantity: number;
}

// Sample food menu data
const MENU_ITEMS: FoodItem[] = [
  { id: 1, name: "Margherita Pizza", price: 12.99, description: "Fresh tomatoes, mozzarella, and basil" },
  { id: 2, name: "Chicken Burger", price: 9.99, description: "Grilled chicken with lettuce and special sauce" },
  { id: 3, name: "Caesar Salad", price: 8.99, description: "Crispy lettuce, croutons, and caesar dressing" },
  { id: 4, name: "Pasta Carbonara", price: 13.99, description: "Creamy pasta with bacon and parmesan" },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const addToCart = (item: FoodItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const paymentLink = await paymentService.processPayment({
        items: cart,
        totalAmount: getTotalPrice(),
      });
      window.location.href = paymentLink;    
    } catch (error) {
      console.error('Payment error:', error);
    
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">Tasty</span>Eats
          </h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="group flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-2.5 rounded-full transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{cart.length}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Today's Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENU_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="aspect-video bg-gray-100 rounded-xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ${item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-end transition-all">
          <div className="bg-white h-full w-full max-w-md p-6 shadow-2xl animate-slide-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some delicious items to get started</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100 max-h-[60vh] overflow-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-gray-50 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-medium transition-colors duration-200"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
