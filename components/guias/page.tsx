import Image from "next/image";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { blogs } from "@/content/article";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BlogArtwork } from "./components/album-artwork";

import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder";
import { Sidebar } from "./components/sidebar";
import { playlists } from "./data/playlists";
import Link from "next/link";

export default function GuiasPage() {
  return (
    <>
      <div className="sm:block md:hidden"></div>
      <div className="sm:block md:block">
        <div className="">
          <div className="bg-background">
            <div className="grid lg:grid-cols-3">
              <div className="col-span-3 lg:col-span-4 ">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Guías
                        </TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                        <TabsTrigger value="live" disabled>
                          Live
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          Añadir guía
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Nuestras mejores guías
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Las mejores opciones para ti. Actualizado
                            diariamente.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {blogs.map((blog) => (
                              <Link
                                href={`/guides/${blog.slug}`}
                                key={blog?.id}
                              >
                                <BlogArtwork
                                  key={blog.image}
                                  blog={blog}
                                  className="w-[250px]"
                                  aspectRatio="portrait"
                                  width={250}
                                  height={330}
                                />
                              </Link>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Guías recomendadas para ti
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Guías a tu medida. Actualizado diariamente.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {blogs.map((blog) => (
                              <Link
                                href={`/guides/${blog.slug}`}
                                key={blog?.id}
                              >
                                <BlogArtwork
                                  key={blog.name}
                                  blog={blog}
                                  className="w-[150px]"
                                  aspectRatio="square"
                                  width={150}
                                  height={150}
                                />
                              </Link>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Nuevos episodios
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Tus podcasts favoritos. Actualizados diariamente.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
