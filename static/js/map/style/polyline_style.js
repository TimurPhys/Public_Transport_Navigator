// Современные цветовые палитры (можно выбрать одну)
const colorPalettes = {
  modernBlue: {
    line: "#3498db", // Яркий синий
    arrow: "#2c3e50", // Тёмно-синий/угольный
    glow: "rgba(52, 152, 219, 0.3)",
  },
  gradientPurple: {
    line: "#8e44ad",
    arrow: "#9b59b6",
    glow: "rgba(142, 68, 173, 0.3)",
  },
  minimalGray: {
    line: "#7f8c8d",
    arrow: "#34495e",
    glow: "rgba(127, 140, 141, 0.2)",
  },
  vibrantTeal: {
    line: "#1abc9c",
    arrow: "#16a085",
    glow: "rgba(26, 188, 156, 0.3)",
  },
};

// Выбираем палитру
const palette = colorPalettes.minimalGray;

function createPolyline(trajectory, type = "dashed") {
  // Стили для разных типов линий
  const styles = {
    default: {
      color: palette.line,
      weight: 4,
      opacity: 0.9,
      lineJoin: "round",
      lineCap: "round",
      className: "animated-polyline", // для CSS анимаций
    },
    dashed: {
      color: palette.line,
      weight: 3,
      opacity: 0.8,
      dashArray: "10, 10",
      lineJoin: "round",
      lineCap: "round",
    },
    thin: {
      color: palette.line,
      weight: 2,
      opacity: 0.7,
      lineJoin: "round",
      lineCap: "round",
    },
  };

  // Создаём полилинию
  const polyline = L.polyline(trajectory, styles[type] || styles.default);

  // Добавляем эффект свечения (через SVG фильтры)
  if (type === "default") {
    polyline.options.className = "glowing-line";
  }

  return polyline;
}

function createArrowsOnPolyline(polyline, arrowStyle = "default") {
  const arrowStyles = {
    default: {
      offset: "5%",
      repeat: "7%",
      pixelSize: 14,
      headAngle: 45,
      polygon: true,
      fillOpacity: 1,
    },
    minimal: {
      offset: "10%",
      repeat: "40%",
      pixelSize: 12,
      headAngle: 60,
      polygon: false,
      weight: 1.5,
    },
    endOnly: {
      offset: "100%",
      repeat: 0,
      pixelSize: 16,
      headAngle: 40,
      polygon: true,
      fillOpacity: 0.9,
    },
  };

  const style = arrowStyles[arrowStyle] || arrowStyles.default;

  const decorator = L.polylineDecorator(polyline, {
    patterns: [
      {
        offset: style.offset,
        repeat: style.repeat,
        symbol: L.Symbol.arrowHead({
          pixelSize: style.pixelSize,
          polygon: style.polygon,
          headAngle: style.headAngle,
          pathOptions: {
            stroke: true,
            color: style.polygon ? palette.arrow : palette.line,
            weight: style.weight || 2,
            opacity: 1,
            fillOpacity: style.fillOpacity || 0.8,
            lineCap: "round",
            lineJoin: "round",
          },
        }),
      },
    ],
  });

  return decorator;
}

export { createArrowsOnPolyline, createPolyline };
