import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";

/**
 * ScrollReveal Component
 * A wrapper component that animates its children when they enter the viewport.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Animation variant ('fade-up', 'fade-down', 'fade-in', 'slide-left', 'slide-right')
 * @param {number} props.delay - Base delay before animation starts (ms)
 * @param {number} props.duration - Duration of animation (ms)
 * @param {number} props.stagger - Stagger delay based on index (ms)
 * @param {number} props.index - Index for stagger calculation
 * @param {number} props.threshold - Intersection threshold (0.0 - 1.0)
 * @param {boolean} props.triggerOnce - Whether to trigger animation only once
 * @param {object} props.style - Inline styles
 */
const ScrollReveal = ({
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  duration = 700,
  stagger = 0,
  index = 0,
  threshold = 0.1,
  triggerOnce = true,
  style = {},
  as: Component = "div",
}) => {
  // Calculate total delay in ms
  const totalDelayMs = delay + stagger * index;

  // Determine transition styles based on variant
  const getVariantStyles = (isVisible) => {
    // Base transition classes
    const baseStyle = `transition-all ease-out transform will-change-transform`;

    // Hidden state styles (when not visible)
    const hiddenStyles = {
      "fade-up": "opacity-0 translate-y-12",
      "fade-down": "opacity-0 -translate-y-12",
      "fade-in": "opacity-0 scale-95",
      "slide-left": "opacity-0 -translate-x-12",
      "slide-right": "opacity-0 translate-x-12",
      none: "opacity-0",
    };

    // Visible state styles
    const visibleStyles = {
      "fade-up": "opacity-100 translate-y-0",
      "fade-down": "opacity-100 translate-y-0",
      "fade-in": "opacity-100 scale-100",
      "slide-left": "opacity-100 translate-x-0",
      "slide-right": "opacity-100 translate-x-0",
      none: "opacity-100",
    };

    const currentHidden = hiddenStyles[variant] || hiddenStyles["fade-up"];
    const currentVisible = visibleStyles[variant] || visibleStyles["fade-up"];

    return isVisible
      ? `${baseStyle} ${currentVisible}`
      : `${baseStyle} ${currentHidden}`;
  };

  // Use the hook without delay, rely on CSS transition-delay for smoother handling
  const [ref, isVisible] = useScrollReveal({
    threshold,
    triggerOnce,
    delay: 0,
  });

  const transitionStyle = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${totalDelayMs}ms`,
    ...style,
  };

  return (
    <Component
      ref={ref}
      className={`${getVariantStyles(isVisible)} ${className}`}
      style={transitionStyle}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
