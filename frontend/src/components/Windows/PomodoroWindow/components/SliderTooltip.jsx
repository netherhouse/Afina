import React, { useEffect, useState } from "react";
import "./SliderTooltip.scss";

const SliderTooltip = ({
  visible,
  value,
  position,
  containerRef,
  handleRef,
  formatValue = (val) => val,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!visible || !containerRef.current || !handleRef.current) {
      return;
    }

    const updatePosition = () => {
      const containerRect = containerRef.current.getBoundingClientRect();
      const handleRect = handleRef.current.getBoundingClientRect();

      // Позиция tooltip относительно контейнера слайдера
      const relativeLeft =
        handleRect.left - containerRect.left + handleRect.width / 2;
      const relativeTop = -40; // Фиксированная высота над слайдером

      setTooltipPosition({
        left: relativeLeft,
        top: relativeTop,
      });
    };

    updatePosition();

    // Обновляем позицию при изменении размера окна
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [visible, position, containerRef, handleRef]);

  if (!visible) return null;

  return (
    <div
      className={`slider-tooltip ${visible ? "slider-tooltip--visible" : ""}`}
      style={{
        left: `${tooltipPosition.left}px`,
        top: `${tooltipPosition.top}px`,
      }}
      aria-live="polite"
      role="tooltip"
    >
      <div className="slider-tooltip__content">{formatValue(value)}</div>
      <div className="slider-tooltip__arrow"></div>
    </div>
  );
};

export default SliderTooltip;
