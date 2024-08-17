import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Blog } from "@/content/article";
import { playlists } from "../data/playlists";

interface BlogArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  blog: Blog;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function BlogArtwork({
  blog,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: BlogArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
            <Image
              src={blog.image}
              alt={blog.title}
              width={width}
              height={height}
              className={cn(
                "h-auto w-auto object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>
        </ContextMenuTrigger>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{blog.title}</h3>
        <p className="text-xs text-muted-foreground">{blog.description}</p>
      </div>
    </div>
  );
}
