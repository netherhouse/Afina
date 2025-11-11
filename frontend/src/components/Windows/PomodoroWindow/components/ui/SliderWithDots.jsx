import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";

const SliderWithDots = ({
  label,
  value,
  onChange,
  onLiveChange,
  min = 1,
  max = 60,
  step = 1,
  values = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPercent, setDragPercent] = useState(null);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  const VISUAL_DOTS = 30;
  const visualDots = useMemo(() => {
    if (values) {
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

  const roundToStep = useCallback(
    (raw) => {
      const stepped = Math.round(raw / step) * step;
      return Math.min(max, Math.max(min, stepped));
    },
    [min, max, step]
  );

  const getSliderPosition = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      return dragPercent;
    }
    return ((value - min) / (max - min)) * 100;
  }, [isDragging, dragPercent, value, min, max]);

  const getProgressPercent = useCallback(() => {
    const basePercent = getSliderPosition();

    if (!sliderRef.current) {
      return basePercent;
    }

    if (!isDragging) {
      if (value === min) return 0;
      if (value === max) return 100;
    } else if (isDragging && dragPercent !== null) {
      if (dragPercent <= 0.5) return 0;
      if (dragPercent >= 99.5) return 100;
    }

    const containerPadding = 12;
    const containerWidth = sliderRef.current.getBoundingClientRect().width;
    const trackWidth = containerWidth - containerPadding * 2;
    const handleCenterPx = (basePercent / 100) * trackWidth;
    const fillToCenterPx = containerPadding + handleCenterPx;
    const fillPercent = (fillToCenterPx / containerWidth) * 100;

    return Math.max(0, Math.min(100, fillPercent));
  }, [getSliderPosition, sliderRef, isDragging, dragPercent, value, min, max]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
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

      setDragPercent(percentage);

      if (onLiveChange) {
        const newValue = min + (percentage / 100) * (max - min);
        const nearest = roundToStep(newValue);
        onLiveChange(nearest);
      }
    },
    [isDragging, min, max, roundToStep, onLiveChange]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      const newValue = min + (dragPercent / 100) * (max - min);
      const nearest = roundToStep(newValue);
      onChange(nearest);
    }

    setIsDragging(false);
    setDragPercent(null);
  }, [isDragging, dragPercent, min, max, onChange, roundToStep]);

  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      setDragPercent(((value - min) / (max - min)) * 100);
    },
    [value, min, max]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      e.preventDefault();
      const touch = e.touches[0];
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)
      );

      setDragPercent(percentage);

      if (onLiveChange) {
        const newValue = min + (percentage / 100) * (max - min);
        const nearest = roundToStep(newValue);
        onLiveChange(nearest);
      }
    },
    [isDragging, min, max, roundToStep, onLiveChange]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging && dragPercent !== null) {
      const newValue = min + (dragPercent / 100) * (max - min);
      const nearest = roundToStep(newValue);
      onChange(nearest);
    }

    setIsDragging(false);
    setDragPercent(null);
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

  useLayoutEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const progress = getProgressPercent();
    const handlePos = getSliderPosition();
    el.style.setProperty("--progress", `${progress}%`);
    el.style.setProperty("--handle-position", `${handlePos}%`);

    const ro = new ResizeObserver(() => {
      const p = getProgressPercent();
      const h = getSliderPosition();
      el.style.setProperty("--progress", `${p}%`);
      el.style.setProperty("--handle-position", `${h}%`);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [
    value,
    min,
    max,
    isDragging,
    dragPercent,
    getProgressPercent,
    getSliderPosition,
  ]);

  const handleDotClick = (dotValue) => {
    const nearest = roundToStep(dotValue);
    onChange(nearest);
  };

  const isDotCompleted = (dotValue) => {
    return value > dotValue;
  };

  const getCurrentValue = () => {
    if (isDragging && dragPercent !== null) {
      const dragValue = min + (dragPercent / 100) * (max - min);
      return roundToStep(dragValue);
    }
    return value;
  };

  const getUnit = () => {
    if (label === "Hours") return "h";
    if (label === "Seconds") return "s";
    if (label === "Rounds") return "";
    return "min";
  };

  return (
    <div className="slider-with-dots">
      <div className="slider-label">{label}</div>
      <div
        className="slider-container"
        ref={sliderRef}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${label} slider`}
      >
        <div className="slider-track">
          {visualDots.map((dot, index) => {
            const leftPercent = dot.leftPercent;
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

          <div
            ref={handleRef}
            className="slider-handle"
            style={{ left: `${getSliderPosition()}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>
      </div>
      <div className="slider-footer">
        <div className="slider-min">
          {min} {getUnit()}
        </div>
        <div className="slider-value">
          {getCurrentValue()} {getUnit()}
        </div>
        <div className="slider-max">
          {max} {getUnit()}
        </div>
      </div>
    </div>
  );
};

export default SliderWithDots;
