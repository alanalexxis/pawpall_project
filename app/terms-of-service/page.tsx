import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/navbar";
import Background from "@/components/background";
import { Main, Section } from "@/components/craft";
import Footer from "@/components/home-page/footer";

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
                        Términos y Condiciones
                      </h1>
                      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        Por favor, lea atentamente nuestros términos y
                        condiciones antes de usar nuestros servicios.
                      </p>
                    </div>
                  </div>
                  <ScrollArea className="h-[600px] w-full border rounded-md mt-8">
                    <div className="p-4 text-sm">
                      <h2 className="text-lg font-bold mb-4">
                        1. Aceptación de los Términos
                      </h2>
                      <p className="mb-4">
                        Al acceder o utilizar la plataforma PawPal, tanto en su
                        versión web como móvil, el usuario acepta los términos y
                        condiciones aquí descritos. Si no está de acuerdo con
                        alguno de estos términos, el usuario debe abstenerse de
                        utilizar el software.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        2. Descripción del servicio
                      </h2>
                      <p className="mb-4">
                        PawPal es una plataforma que facilita el cuidado
                        integral de las mascotas, brindando herramientas como
                        seguimiento de salud, recordatorios de citas, control
                        nutricional y conexión con profesionales del cuidado
                        animal.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        3. Licencia de uso
                      </h2>
                      <p className="mb-4">
                        PawPal otorga al usuario una licencia limitada, no
                        exclusiva, no transferible y revocable para utilizar el
                        software únicamente con fines personales y no
                        comerciales. El usuario no podrá copiar, modificar,
                        distribuir, vender o ceder el software sin previa
                        autorización escrita de PawPal.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        4. Propiedad intelectual
                      </h2>
                      <p className="mb-4">
                        Todo el contenido, diseño, código y demás elementos
                        asociados con PawPal son propiedad exclusiva de la
                        empresa y están protegidos por las leyes de derechos de
                        autor. El uso indebido de cualquier material de la
                        plataforma será sancionado conforme a las normativas
                        aplicables.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        5. Responsabilidades del usuario
                      </h2>
                      <p className="mb-4">
                        El usuario se compromete a hacer un uso adecuado del
                        software, evitando cualquier acción que pueda
                        comprometer la seguridad, el funcionamiento o la
                        experiencia de otros usuarios en la plataforma. PawPal
                        no se hace responsable de cualquier daño o pérdida
                        derivada de un uso indebido o no autorizado del
                        software.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        6. Limitaciones de responsabilidad
                      </h2>
                      <p className="mb-4">
                        PawPal no garantiza que el servicio esté libre de
                        errores o interrupciones. En caso de fallas técnicas, se
                        trabajará en resolverlas lo más pronto posible. El
                        usuario acepta que PawPal no será responsable por daños
                        directos o indirectos resultantes del uso de la
                        plataforma.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        7. Modificaciones a los términos
                      </h2>
                      <p className="mb-4">
                        PawPal se reserva el derecho de modificar estos términos
                        y condiciones en cualquier momento. Cualquier cambio
                        será notificado a los usuarios a través de los medios
                        apropiados, y el uso continuo del software se
                        considerará como aceptación de los nuevos términos.
                      </p>

                      <h2 className="text-lg font-bold mb-4">
                        8. Cancelación del servicio
                      </h2>
                      <p className="mb-4">
                        PawPal puede suspender o cancelar la cuenta del usuario
                        en caso de incumplimiento de estos términos, sin
                        necesidad de previo aviso.
                      </p>
                      <h2 className="text-lg font-bold mb-4">
                        9. Tipo de licencia
                      </h2>
                      <p className="mb-4">
                        La plataforma PawPal está disponible bajo una licencia
                        de uso gratuita y una premium, estás licencias no
                        conceden derechos de propiedad intelectual ni de
                        redistribución.
                      </p>
                      <h2 className="text-lg font-bold mb-4">
                        10. Ley Aplicable
                      </h2>
                      <p className="mb-4">
                        Estos términos y condiciones se rigen e interpretan de
                        acuerdo con las leyes y usted se somete irrevocablemente
                        a la jurisdicción exclusiva de los tribunales en ese
                        estado o localidad.
                      </p>
                    </div>
                  </ScrollArea>
                  <div className="flex justify-center mt-28">
                    <Button variant={"ringHover"}>
                      Al continuar aceptas los términos y condiciones
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
