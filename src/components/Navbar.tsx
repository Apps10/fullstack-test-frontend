import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../redux/hooks/useOrderStore";

export const Navbar = () => {
  const { productsSelected } = useOrderStore();
  const cartCount = productsSelected.length

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-40 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-primary transition-colors">
            Mi Tienda Online
          </h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center hover:text-primary transition-colors cursor-pointer">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -bottom-3 -right-3 bg-primary text-indigo-700 text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {
          

        }
      </div>
    </header>
  );
};
