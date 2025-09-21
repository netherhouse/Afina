import React, { useState, useCallback, useRef, useMemo } from "react";
import SliderTooltip from "./SliderTooltip";

const SliderWithDots = ({
  label,
  value,
  onChange,
  min = 1,
  max = 60,
  step = 1,
  values = null, // Предопределенные значения для точек
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPercent, setDragPercent] = useState(null); // Локальная позиция во время перетаскивания
  const [showTooltip, setShowTooltip] = useState(false);
  const [hideTooltipTimeout, setHideTooltipTimeout] = useState(null);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  // Создаем точки
  const dots = useMemo(() => {
    if (values) {
      // Используем предопределенные значения
      return values;
    } else {
      // Создаем равномерно распределенные точки
      const dotCount = Math.min(15, Math.ceil((max - min) / step) + 1);
      const result = [];

      for (let i = 0; i < dotCount; i++) {
        const dotValue = min + (i * (max - min)) / (dotCount - 1);
        result.push(Math.round(dotValue / step) * step);
      }

      return [...new Set(result)]; // Убираем дубликаты
    }
  }, [min, max, step, values]);

  // Найти ближайшую точку
  const findNearestDot = useCallback(
    (currentValue) => {
      return dots.reduce((nearest, dot) => {
        return Math.abs(dot - currentValue) < Math.abs(nearest - currentValue)
          ? dot
          : nearest;
      });
    },
    [dots]
  );

  // Получить позицию ползунка (0-100%)
  const getSliderPosition = () => {
    // Во время перетаскивания используем локальную позицию
    if (isDragging && dragPercent !== null) {
      return dragPercent;
    }
    return ((value - min) / (max - min)) * 100;
  };

  // Управление tooltip
  const showTooltipWithDelay = useCallback(() => {
    if (hideTooltipTimeout) {
      clearTimeout(hideTooltipTimeout);
      setHideTooltipTimeout(null);
    }
    setShowTooltip(true);
  }, [hideTooltipTimeout]);

  const hideTooltipWithDelay = useCallback((delay = 200) => {
    const timeout = setTimeout(() => {
      setShowTooltip(false);
    }, delay);
    setHideTooltipTimeout(timeout);
  }, []);

  const shouldShowTooltip = isDragging; // Показываем tooltip только во время перетаскивания

  // Обновляем состояние tooltip
  React.useEffect(() => {
    if (shouldShowTooltip) {
      showTooltipWithDelay();
    } else {
      hideTooltipWithDelay();
    }
  }, [shouldShowTooltip, showTooltipWithDelay, hideTooltipWithDelay]);

  // Форматирование значения для tooltip
  const formatTooltipValue = useCallback(
    (val) => {
      const unit =
        label === "Hours"
          ? "h"
          : label === "Seconds"
          ? "s"
          : label === "Rounds"
          ? ""
          : "min";
      return `${val}${unit}`;
    },
    [label]
  );

  // Получаем текущее значение для отображения в tooltip
  const getCurrentTooltipValue = () => {
    if (isDragging && dragPercent !== null) {
      const dragValue = min + (dragPercent / 100) * (max - min);
      const nearestDot = findNearestDot(dragValue);
      return nearestDot;
    }
    return value;
  };

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    setShowTooltip(true);
    // Устанавливаем начальную позицию перетаскивания
    setDragPercent(((value - min) / (max - min)) * 100);
  }, [value, min, max]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );

      // Обновляем локальную позицию для плавного движения
      setDragPercent(percentage);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      // Только при отпускании мыши фиксируем значение к ближайшей точке
      const newValue = min + (dragPercent / 100) * (max - min);
      const nearestDot = findNearestDot(newValue);
      onChange(nearestDot);
    }

    setIsDragging(false);
    setDragPercent(null);
    // Скрываем tooltip немедленно при отпускании
    setShowTooltip(false);
  }, [isDragging, dragPercent, min, max, findNearestDot, onChange]);

  // Добавляем обработчики hover
  // Touch event handlers для мобильных устройств
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault(); // Предотвращаем скролл страницы
      setIsDragging(true);
      setShowTooltip(true);
      setDragPercent(((value - min) / (max - min)) * 100);
    },
    [value, min, max]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      e.preventDefault(); // Предотвращаем скролл страницы
      const touch = e.touches[0];
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)
      );

      setDragPercent(percentage);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      const newValue = min + (dragPercent / 100) * (max - min);
      const nearestDot = findNearestDot(newValue);
      onChange(nearestDot);
    }

    setIsDragging(false);
    setDragPercent(null);
    // Скрываем tooltip немедленно при отпускании touch
    setShowTooltip(false);
  }, [isDragging, dragPercent, min, max, findNearestDot, onChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Cleanup timeout при unmount
  React.useEffect(() => {
    return () => {
      if (hideTooltipTimeout) {
        clearTimeout(hideTooltipTimeout);
      }
    };
  }, [hideTooltipTimeout]);

  const handleDotClick = (dotValue) => {
    onChange(dotValue);
  };

  // Определяем, является ли точка завершенной (слева от активной)
  const isDotCompleted = (dotValue) => {
    return dotValue < value;
  };

  return (
    <div className="slider-with-dots">
      <div className="slider-label">{label}</div>
      <div
        className="slider-container"
        ref={sliderRef}
        style={{ "--progress": `${getSliderPosition()}%` }}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${label} slider`}
      >
        <div className="slider-track">
          {/* Точки на треке */}
          {dots.map((dot, index) => {
            // Если передан массив предопределенных значений (values),
            // рисуем точки равномерно по индексу, чтобы не было плотных кластеров.
            const denom = Math.max(1, dots.length - 1);
            const leftPercent = values
              ? (index / denom) * 100
              : ((dot - min) / (max - min)) * 100;

            return (
              <div
                key={index}
                className={`slider-dot ${
                  value === dot
                    ? "active"
                    : isDotCompleted(dot)
                    ? "completed"
                    : ""
                }`}
                style={{ left: `${leftPercent}%` }}
                onClick={() => handleDotClick(dot)}
              />
            );
          })}

          {/* Ползунок */}
          <div
            ref={handleRef}
            className="slider-handle"
            style={{ left: `${getSliderPosition()}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />

          {/* Tooltip */}
          <SliderTooltip
            visible={showTooltip}
            value={getCurrentTooltipValue()}
            position={getSliderPosition()}
            containerRef={sliderRef}
            handleRef={handleRef}
            formatValue={formatTooltipValue}
          />
        </div>
      </div>
      <div className="slider-footer">
        <div className="slider-min">
          {min}{" "}
          {label === "Hours"
            ? "h"
            : label === "Seconds"
            ? "s"
            : label === "Rounds"
            ? ""
            : "min"}
        </div>
        <div className="slider-value">
          {value}{" "}
          {label === "Hours"
            ? "h"
            : label === "Seconds"
            ? "s"
            : label === "Rounds"
            ? ""
            : "min"}
        </div>
        <div className="slider-max">
          {max}{" "}
          {label === "Hours"
            ? "h"
            : label === "Seconds"
            ? "s"
            : label === "Rounds"
            ? ""
            : "min"}
        </div>
      </div>
    </div>
  );
};

export default SliderWithDots;
