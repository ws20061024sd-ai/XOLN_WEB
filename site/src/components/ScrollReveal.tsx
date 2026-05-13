"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // 默认可见，防止 hydration 异常时内容被 opacity:0 永久遮住
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // 检查元素是否已在视口内
    const alreadyVisible = node.getBoundingClientRect().top < window.innerHeight;
    if (alreadyVisible) {
      setVisible(true);
      return;
    }

    // 不在视口内，先隐藏等滚动到才显示
    setVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
