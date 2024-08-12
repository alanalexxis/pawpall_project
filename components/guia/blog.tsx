import BlogCardSection from "@/components/blog-card-section";
import FloatingBadge from "@/components/floating-badge";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/video-player";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Github } from "lucide-react";
import Link from "next/link";

export default function GuiaBlog() {
  return (
    <PageWrapper>
      <div className="flex flex-col flex-wrap items-center justify-center mt-[3rem] mb-[6rem] p-3 w-full max-w-[650px]">
        <div className="flex justify-end items-center mb-1 w-full"></div>
        <div className="flex flex-col items-start justify-center w-full gap-2 mb-4 ">
          <h1 className="scroll-m-20 text-xl font-medium tracking-tight">
            Render Your Blog Using HTML instead of Markdown
          </h1>
          <Separator />
        </div>
        <div className="w-full">
          <VideoPlayer videoSrc="https://utfs.io/f/45ce5f08-1c16-42f6-a9d2-9037a62018d1-fsqn4g.mp4" />
        </div>
        <BlogCardSection />
      </div>
      <FloatingBadge />
    </PageWrapper>
  );
}
