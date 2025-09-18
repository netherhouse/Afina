import React, { useState, useCallback, useRef, useMemo } from "react";

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
  const sliderRef = useRef(null);

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

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
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
  }, [isDragging, dragPercent, min, max, findNearestDot, onChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
            className="slider-handle"
            style={{ left: `${getSliderPosition()}%` }}
            onMouseDown={handleMouseDown}
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
