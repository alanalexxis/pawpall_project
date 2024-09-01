import { useState, useEffect } from "react";

function useWindowSize() {
  // Inicializar el estado con las dimensiones de la ventana
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Función que se ejecutará al cambiar el tamaño de la ventana
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Añadir el event listener
    window.addEventListener("resize", handleResize);

    // Ejecutar la función para establecer el tamaño inicial
    handleResize();

    // Limpiar el event listener cuando el componente se desmonte
    return () => window.removeEventListener("resize", handleResize);
  }, []); // La dependencia vacía asegura que el efecto solo se ejecute una vez

  return windowSize;
}

export default useWindowSize;
