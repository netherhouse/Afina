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
  // Use a ref for the hide-tooltip timeout to avoid triggering re-renders
  // when the timeout ID changes (which previously caused the maximum
  // update depth exceeded error).
  const hideTooltipTimeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  // Визуальные точки: всегда показываем фиксированное количество маркеров
  // (например 30), но реальные значения рассчитываются независимо и
  // привязываются к шагу (step). Это позволяет иметь видимые точки,
  // между которыми можно выбирать значения по единице (или по step).
  const VISUAL_DOTS = 30;
  const visualDots = useMemo(() => {
    if (values) {
      // Если передан массив значений, используем их (равномерно распределив по визуальным позициям)
      const denom = Math.max(1, values.length - 1);
      return values.map((v, i) => ({
        leftPercent: (i / denom) * 100,
        value: v,
      }));
    }

    const arr = [];
    for (let i = 0; i < VISUAL_DOTS; i++) {
      const leftPercent = (i / (VISUAL_DOTS - 1)) * 100;
      const exactValue = min + (leftPercent / 100) * (max - min);
      arr.push({ leftPercent, value: exactValue });
    }
    return arr;
  }, [min, max, values]);

  // Round a raw value to nearest selectable step and clamp to [min, max]
  const roundToStep = useCallback(
    (raw) => {
      const stepped = Math.round(raw / step) * step;
      return Math.min(max, Math.max(min, stepped));
    },
    [min, max, step]
  );

  // Получить позицию ползунка (0-100%) для центра ручки
  const getSliderPosition = () => {
    // Во время перетаскивания используем локальную позицию
    if (isDragging && dragPercent !== null) {
      return dragPercent;
    }
    return ((value - min) / (max - min)) * 100;
  };

  // Вычислить корректную позицию для CSS --progress с учетом размеров ручки
  // Цель: заполнение должно доходить до центра ручки на промежуточных позициях.
  // Доп. требование: если активна первая точка — 0%, если последняя — 100%.
  const getProgressPercent = () => {
    const basePercent = getSliderPosition();

    if (!sliderRef.current) {
      return basePercent;
    }

    // Жестко выставляем 0%/100% на крайних значениях
    // 1) Когда значение слайдера равно минимуму/максимуму (щелчок по первой/последней точке)
    if (!isDragging) {
      if (value === min) return 0;
      if (value === max) return 100;
    } else if (isDragging && dragPercent !== null) {
      // 2) Во время перетаскивания — если дошли до визуальных краев
      if (dragPercent <= 0.5) return 0; // допускаем небольшой порог
      if (dragPercent >= 99.5) return 100;
    }

    // Получаем размеры трека (эффективная область без padding)
    const containerPadding = 12; // padding: 6px 12px в CSS
    const containerWidth = sliderRef.current.getBoundingClientRect().width;
    const trackWidth = containerWidth - containerPadding * 2;

    // Позиция центра ручки в пикселях внутри трека
    const handleCenterPx = (basePercent / 100) * trackWidth;

    // Позиция для градиента: от левого края контейнера до центра ручки
    // Учитываем padding + позицию центра ручки
    const fillToCenterPx = containerPadding + handleCenterPx;
    const fillPercent = (fillToCenterPx / containerWidth) * 100;

    return Math.max(0, Math.min(100, fillPercent));
  };

  // Управление tooltip
  const showTooltipWithDelay = useCallback(() => {
    if (hideTooltipTimeoutRef.current) {
      clearTimeout(hideTooltipTimeoutRef.current);
      hideTooltipTimeoutRef.current = null;
    }
    setShowTooltip(true);
  }, []);

  const hideTooltipWithDelay = useCallback((delay = 200) => {
    if (hideTooltipTimeoutRef.current) {
      clearTimeout(hideTooltipTimeoutRef.current);
    }
    hideTooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      hideTooltipTimeoutRef.current = null;
    }, delay);
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
      return roundToStep(dragValue);
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
      // При отпускании мыши фиксируем значение к ближайшему шагу (step).
      const newValue = min + (dragPercent / 100) * (max - min);
      const nearest = roundToStep(newValue);
      onChange(nearest);
    }

    setIsDragging(false);
    setDragPercent(null);
    // Скрываем tooltip немедленно при отпускании
    setShowTooltip(false);
  }, [isDragging, dragPercent, min, max, onChange, roundToStep]);

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
      const nearest = roundToStep(newValue);
      onChange(nearest);
    }

    setIsDragging(false);
    setDragPercent(null);
    // Скрываем tooltip немедленно при отпускании touch
    setShowTooltip(false);
  }, [isDragging, dragPercent, min, max, onChange, roundToStep]);

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
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleDotClick = (dotValue) => {
    // dotValue here might be an exact value (from visualDots). Map it to nearest step
    const nearest = roundToStep(dotValue);
    onChange(nearest);
  };

  // Определяем, является ли визуальная точка завершенной (слева от активной позиции)
  const isDotCompleted = (dotValue) => {
    // dotValue here may be exact position value (not rounded). Compare raw values for visual fill.
    return value > dotValue;
  };

  return (
    <div className="slider-with-dots">
      <div className="slider-label">{label}</div>
      <div
        className="slider-container"
        ref={sliderRef}
        style={{
          "--progress": `${getProgressPercent()}%`,
          "--handle-position": `${getSliderPosition()}%`,
        }}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${label} slider`}
      >
        <div className="slider-track">
          {/* Точки на треке */}
          {visualDots.map((dot, index) => {
            const leftPercent = dot.leftPercent;
            // Determine active if rounded value equals current value
            const roundedDot = roundToStep(dot.value);
            const isActiveDot = roundedDot === value;

            return (
              <div
                key={index}
                className={`slider-dot ${
                  isActiveDot
                    ? "active"
                    : isDotCompleted(dot.value)
                    ? "completed"
                    : ""
                }`}
                style={{ left: `${leftPercent}%` }}
                onClick={() => handleDotClick(dot.value)}
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
