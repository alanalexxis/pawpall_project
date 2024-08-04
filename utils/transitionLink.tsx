"use client";
import { usePathname, useRouter } from "next/navigation";
import { animatePageOut } from "@/utils/animation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

interface Props {
  href: string;
  label: string;
}

const TransitionLink = ({ href, label }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname !== href) {
      animatePageOut(href, router);
    }
  };

  return (
    <Button
      variant="expandIcon"
      Icon={ArrowRightIcon}
      iconPlacement="right"
      onClick={handleClick}
      className=" text-white"
    >
      {label}
    </Button>
  );

  <>Icon right</>;
};

export default TransitionLink;
