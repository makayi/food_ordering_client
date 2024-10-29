import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Navigation({ cartCount = 0, onCartClick }: NavigationProps) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">Tasty</span>Eats
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/orders" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Orders
            </Link>
          </nav>
        </div>
        {onCartClick && (
          <button
            onClick={onCartClick}
            className="group flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-2.5 rounded-full transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{cartCount}</span>
          </button>
        )}
      </div>
    </header>
  );
} 