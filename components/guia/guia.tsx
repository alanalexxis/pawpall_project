"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export default function Guias() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState([
    {
      id: 1,
      type: "image",
      title: "Serene Landscape",
      description: "A tranquil mountain scene captured at golden hour.",
      src: "/placeholder.svg",
      category: "nature",
    },
    {
      id: 2,
      type: "video",
      title: "Cityscape Timelapse",
      description: "A dynamic timelapse showcasing the bustling city skyline.",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      category: "urban",
    },
    {
      id: 3,
      type: "image",
      title: "Architectural Symmetry",
      description:
        "A minimalist architectural composition highlighting clean lines.",
      src: "/placeholder.svg",
      category: "architecture",
    },
    {
      id: 4,
      type: "video",
      title: "Underwater Exploration",
      description:
        "A captivating underwater journey through a vibrant coral reef.",
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      category: "nature",
    },
    {
      id: 5,
      type: "image",
      title: "Abstract Expressionism",
      description: "A bold and colorful abstract painting.",
      src: "/placeholder.svg",
      category: "art",
    },
    {
      id: 6,
      type: "image",
      title: "Geometric Patterns",
      description:
        "A visually striking composition of geometric shapes and lines.",
      src: "/placeholder.svg",
      category: "design",
    },
  ]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleFilterChange = (filter: SetStateAction<string>) => {
    setActiveFilter(filter);
  };
  const handleItemClick = (item: SetStateAction<null>) => {
    setSelectedItem(item);
    setIsLightboxOpen(true);
  };
  const handleLightboxClose = () => {
    setIsLightboxOpen(false);
    setSelectedItem(null);
  };
  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-center">
        <div className="flex gap-4">
          <Button
            variant={activeFilter === "all" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "nature" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("nature")}
          >
            Nature
          </Button>
          <Button
            variant={activeFilter === "urban" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("urban")}
          >
            Urban
          </Button>
          <Button
            variant={activeFilter === "architecture" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("architecture")}
          >
            Architecture
          </Button>
          <Button
            variant={activeFilter === "art" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("art")}
          >
            Art
          </Button>
          <Button
            variant={activeFilter === "design" ? "ghost" : "outline"}
            onClick={() => handleFilterChange("design")}
          >
            Design
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"
          >
            {item.type === "image" ? (
              <img
                src="/placeholder.svg"
                alt={item.title}
                width={600}
                height={400}
                className="h-64 w-full object-cover"
                style={{ aspectRatio: "600/400", objectFit: "cover" }}
              />
            ) : (
              <div
                className="h-64 w-full cursor-pointer bg-cover bg-center"
                style={{ backgroundImage: `url(${item.src})` }}
              >
                <div className="flex h-full items-center justify-center bg-black/50 text-white">
                  <PlayIcon className="h-12 w-12" />
                </div>
              </div>
            )}
            <div className="p-4 bg-background">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isLightboxOpen && selectedItem && (
        <Dialog open={isLightboxOpen} onOpenChange={handleLightboxClose}>
          <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            {selectedItem.type === "image" ? (
              <img
                src="/placeholder.svg"
                alt={selectedItem.title}
                width={800}
                height={600}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                style={{ aspectRatio: "800/600", objectFit: "cover" }}
              />
            ) : (
              <video
                src={selectedItem.src}
                controls
                className="max-h-[90vh] max-w-[90vw]"
              />
            )}
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/10"
              >
                <XIcon className="h-6 w-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
