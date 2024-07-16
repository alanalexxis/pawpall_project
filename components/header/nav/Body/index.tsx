import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./style.module.css";
import { blur, translate } from "../../anim";

interface Link {
  title: string;
  href: string;
}

interface SelectedLink {
  isActive: boolean;
  index: number;
}

// Asegúrate de que esta interfaz esté disponible globalmente si es necesaria en otras partes del archivo

export default function Body({
  links,
  selectedLink,
  setSelectedLink,
}: {
  links: Link[]; // Aquí se usa la interfaz Link para tipar los elementos de 'links'
  selectedLink: SelectedLink;
  setSelectedLink: React.Dispatch<React.SetStateAction<SelectedLink>>;
}) {
  const getChars = (word: string): JSX.Element[] => {
    let chars: JSX.Element[] = [];
    word.split("").forEach((char, i) => {
      chars.push(
        <motion.span
          custom={[i * 0.02, (word.length - i) * 0.01]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
        >
          {char}
        </motion.span>
      );
    });
    return chars;
  };

  return (
    <div className={styles.body}>
      {links.map((link, index) => {
        // Se elimina el tipado 'any' implícito
        const { title, href } = link;
        return (
          <Link key={`l_${index}`} href={href}>
            <motion.p
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != index
                  ? "open"
                  : "closed"
              }
            >
              {getChars(title)}
            </motion.p>
          </Link>
        );
      })}
    </div>
  );
}
