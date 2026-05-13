"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setTransitioning(false);
        prevPathname.current = pathname;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
