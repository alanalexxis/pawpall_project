import { useState, useEffect } from "react";
// Define the type for the window size
type WindowSize = {
  width: number;
  height: number;
};

function useWindowSize() {
  // Inicializar el estado con las dimensiones de la ventana
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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
