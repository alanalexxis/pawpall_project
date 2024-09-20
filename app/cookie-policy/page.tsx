import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavBar } from "@/components/navbar";
import Background from "@/components/background";
import { Main, Section } from "@/components/craft";
import Footer from "@/components/home-page/footer";
import { Accordion, AccordionContent } from "@/components/ui/accordion";
import { AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";

export default function TermsAndConditions() {
  return (
    <>
      <NavBar />
      <Main>
        <div className="min-h-screen  flex flex-col">
          <Section className="relative">
            <Background />
            <main className="flex-1">
              <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                        Política de Cookies y Permisos
                      </h1>
                      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        Información sobre el uso de cookies y permisos
                        especiales en nuestra aplicación
                      </p>
                    </div>
                  </div>
                  <ScrollArea className="h-[600px] w-full border rounded-md mt-8">
                    <div className="p-4 text-sm space-y-6">
                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          ¿Qué son las cookies?
                        </h2>
                        <p>
                          Las cookies son pequeños archivos de texto que se
                          almacenan en su dispositivo (ordenador, tablet o
                          móvil) cuando visita un sitio web. Se utilizan
                          ampliamente para hacer que los sitios web funcionen de
                          manera más eficiente, así como para proporcionar
                          información a los propietarios del sitio.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          ¿Cómo utilizamos las cookies?
                        </h2>
                        <p>
                          Utilizamos cookies por varias razones, detalladas a
                          continuación. Desafortunadamente, en la mayoría de los
                          casos no existen opciones estándar de la industria
                          para deshabilitar las cookies sin deshabilitar
                          completamente la funcionalidad y características que
                          agregan a este sitio. Se recomienda que deje activadas
                          todas las cookies si no está seguro de si las necesita
                          o no, en caso de que se utilicen para proporcionar un
                          servicio que usted utiliza.
                        </p>
                      </section>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            Cookies necesarias
                          </AccordionTrigger>
                          <AccordionContent>
                            Estas cookies son esenciales para el funcionamiento
                            básico del sitio web. Incluyen cookies que permiten
                            recordar sus preferencias de navegación y su sesión
                            de usuario.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="mt-2">
                          <AccordionTrigger>
                            Cookies de rendimiento
                          </AccordionTrigger>
                          <AccordionContent>
                            Estas cookies nos ayudan a entender cómo los
                            visitantes interactúan con nuestro sitio web
                            recopilando y reportando información de forma
                            anónima. Nos permiten mejorar constantemente la
                            experiencia del usuario.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="mt-2">
                          <AccordionTrigger>
                            Cookies de funcionalidad
                          </AccordionTrigger>
                          <AccordionContent>
                            Estas cookies permiten que el sitio web recuerde las
                            elecciones que usted hace (como su nombre de
                            usuario, idioma o la región en la que se encuentra)
                            y proporcione características mejoradas y más
                            personales.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="mt-2">
                          <AccordionTrigger>
                            Cookies de publicidad
                          </AccordionTrigger>
                          <AccordionContent>
                            Estas cookies se utilizan para mostrar anuncios que
                            sean relevantes para usted y sus intereses. También
                            se utilizan para limitar el número de veces que ve
                            un anuncio, así como para ayudar a medir la
                            efectividad de las campañas publicitarias.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Control de cookies
                        </h2>
                        <p>
                          Puede controlar y/o eliminar las cookies como desee.
                          Puede eliminar todas las cookies que ya están en su
                          dispositivo y puede configurar la mayoría de los
                          navegadores para que no las acepten. Sin embargo, si
                          hace esto, es posible que tenga que ajustar
                          manualmente algunas preferencias cada vez que visite
                          un sitio y que algunos servicios y funcionalidades no
                          funcionen.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Permisos Especiales
                        </h2>
                        <p>
                          Para el correcto funcionamiento de PawPal, la
                          aplicación requiere acceso a ciertos permisos en los
                          dispositivos de los usuarios. Estos permisos son
                          necesarios para ofrecer todas las funcionalidades y
                          garantizar una experiencia óptima:
                        </p>
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full mt-2"
                        >
                          <AccordionItem value="permiso-1">
                            <AccordionTrigger>
                              Permiso de Notificaciones
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc pl-4">
                                <li>
                                  Permite enviar notificaciones push para
                                  recordatorios de citas veterinarias,
                                  alimentación, paseos y otros eventos
                                  importantes relacionados con el cuidado de la
                                  mascota.
                                </li>
                                <li>
                                  Las notificaciones aseguran que el usuario
                                  esté al tanto de las necesidades y cuidados de
                                  su mascota, así como de alertas importantes o
                                  actualizaciones de la aplicación.
                                </li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="permiso-2" className="mt-2">
                            <AccordionTrigger>
                              Permiso de GPS (Ubicación)
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="list-disc pl-4">
                                <li>
                                  Se utiliza para programar y monitorear paseos,
                                  localizar veterinarios o cuidadores cercanos,
                                  y para cualquier funcionalidad basada en la
                                  ubicación geográfica.
                                </li>
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Más información
                        </h2>
                        <p>
                          Para obtener más información sobre cómo utilizamos las
                          cookies y los permisos especiales, y cómo puede
                          gestionarlos, no dude en contactarnos.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-center mt-28">
                    <Button variant={"ringHover"}>
                      Al continuar acepto todas las cookies
                    </Button>
                  </div>
                </div>
              </section>
            </main>
          </Section>
        </div>
        <div className="-mt-14">
          <Footer />
        </div>
      </Main>
    </>
  );
}
