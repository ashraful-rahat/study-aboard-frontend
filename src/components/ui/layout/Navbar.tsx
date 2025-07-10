"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  ReactNode,
  createContext,
  useContext,
  ButtonHTMLAttributes,
} from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "default", size = "md", className = "", ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium focus:outline-none transition";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    };
    const sizes = {
      sm: "px-3 py-2 text-sm rounded-lg",
      md: "px-5 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl",
    };
    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Sheet components
interface SheetContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: ReactNode;
}) {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("SheetTrigger must be used within a Sheet");
  const child = React.Children.only(children);
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(
      child as React.ReactElement<React.HTMLProps<Element>>,
      {
        ...(typeof child.props === "object" && child.props !== null
          ? child.props
          : {}),
        onClick: (e: React.MouseEvent) => {
          if (
            child.props &&
            typeof (child.props as { onClick?: (e: React.MouseEvent) => void })
              .onClick === "function"
          ) {
            (
              child.props as { onClick?: (e: React.MouseEvent) => void }
            ).onClick?.(e);
          }
          ctx.setOpen(true);
        },
      }
    );
  }
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>;
}

export function SheetContent({
  side = "left",
  className = "",
  children,
}: {
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("SheetContent must be used within a Sheet");
  if (!ctx.open) return null;
  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex",
        side === "left" ? "justify-start" : "justify-end"
      )}
      style={{ background: "rgba(0,0,0,0.2)" }}
      onClick={() => ctx.setOpen(false)}
    >
      <div
        className={clsx(
          "bg-white h-full shadow-xl transition-transform duration-300",
          side === "left" ? "translate-x-0" : "translate-x-0",
          className
        )}
        style={{
          width: 350,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "University", href: "/university" },
    { name: "Country", href: "/country" },
    { name: "Course", href: "/course" },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg border-b border-gray-200"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-4xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
            >
              EduPortal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-6 py-4 rounded-xl text-lg font-medium transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
            <Button className="ml-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-14 w-14 rounded-xl hover:bg-gray-100"
                >
                  <Menu className="h-7 w-7 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] bg-white p-0">
                <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-gray-100">
                    <Link href="/" className="text-3xl font-bold text-blue-600">
                      EduPortal
                    </Link>
                  </div>
                  <div className="flex-1 py-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-8 py-5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-lg font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="px-8 mt-8">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
