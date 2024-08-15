import { buttonVariants } from "@/components/ui/button";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { blogs } from "@/content/article";
import { getBlogs } from "@/content/functions/get-blog-slug";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import parse, { domToReact } from "html-react-parser";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const response = getBlogs(params?.slug);

    if (!response || response.length === 0) {
      return {
        title: "Not Found",
        description: "The page you are looking for does not exist",
      };
    }

    return {
      openGraph: {
        title: response?.[0]?.title,
        description: response?.[0]?.description,
        images: [response?.[0]?.image],
      },
      keywords: [...response?.[0]?.keywords],
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching the page content",
    };
  }
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    params: { slug: blog.slug || blog.name.toLowerCase().replace(/ /g, "-") },
  }));
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const response = getBlogs(params?.slug);
  return (
    <PageWrapper>
      <article className="container relative max-w-3xl ">
        <div className="flex justify-end items-center w-full min-[1280px]:hidden">
          <Link
            href="/guides"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            <p className="text-sm"> Ver todas las guías</p>
          </Link>
        </div>
        <Link
          href="/guides"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute rounded left-[-200px] top-14 hidden xl:inline-flex"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <p className="text-sm"> Ver todas las guías</p>
        </Link>
        <div>
          <p className="block text-sm text-muted-foreground">
            Published on{" "}
            {new Date(response?.[0]?.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-[1rem]">
          {parse(response?.[0]?.article || "", {
            replace: transformNode,
          })}
        </div>
        <hr className="mt-12" />
        <div className="flex justify-center py-6 lg:py-10">
          <Link
            href="/guides"
            className={cn(buttonVariants({ variant: "ghost" }), "rounded")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            <p className="text-sm"> Ver todas las guías</p>
          </Link>
        </div>
      </article>
    </PageWrapper>
  );
}

const transformNode = (node: any) => {
  if (node.type === "tag" && node.name === "p") {
    let className = "leading-7 text-sm";
    if (!node.parent || node.parent.name !== "li") {
      className += " mt-6";
    }
    node.attribs.class = `${node.attribs.class || ""} ${className}`.trim();
  }

  if (node.type === "tag" && node.name === "a") {
    node.attribs.class =
      "font-medium text-primary underline underline-offset-4";
  }

  if (node.type === "tag" && node.name === "h1") {
    node.attribs.class = "scroll-m-20 text-xl font-medium pt-4 tracking-tight";
  }

  if (node.type === "tag" && node.name === "h2") {
    node.attribs.class =
      "mt-10 scroll-m-20 border-b pb-2 text-lg font-medium tracking-tight transition-colors first:mt-0";
  }

  if (node.type === "tag" && node.name === "h3") {
    node.attribs.class = "mt-8 scroll-m-20 text-md font-medium tracking-tight";
  }

  if (node.type === "tag" && node.name === "ul") {
    node.attribs.class = "my-4 ml-6 list-disc [&>li]:mt-2";
  }

  if (node.type === "tag" && node.name === "ol") {
    node.attribs.class = "my-4 ml-6 list-decimal [&>li]:mt-2";
  }

  if (node.type === "tag" && node.name === "li") {
    node.attribs.class = "mt-2";
  }

  if (node.type === "tag" && node.name === "blockquote") {
    node.attribs.class = "mt-6 border-l-2 pl-6 italic";
  }

  if (node.type === "tag" && node.name === "code") {
    if (!node.parent || node.parent.name !== "pre") {
      node.attribs.class =
        "relative rounded px-2 bg-muted font-mono text-sm font-medium";
    }
  }

  if (node.type === "tag" && node.name === "pre") {
    node.attribs.class =
      "mb-4 mt-6 overflow-x-auto px-4 rounded border bg-secondary";
    const codeNode = node.children.find((child: any) => child.name === "code");
    if (codeNode) {
      codeNode.attribs.class = "relative rounded p-0 font-mono text-sm";
    }
  }

  return domToReact(node);
};
