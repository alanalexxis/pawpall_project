"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Background() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Después de que el componente se haya montado en el cliente, establecer `mounted` en true
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Mientras `mounted` es false, renderiza un marcador de posición o nada
    return null;
  }

  return (
    <div>
      {theme === "dark" ? (
        <div className="fixed inset-0 -z-10 h-full w-full bg-black">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
        </div>
      ) : (
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      )}
    </div>
  );
}
