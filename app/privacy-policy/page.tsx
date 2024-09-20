import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
                        Aviso de Privacidad
                      </h1>
                      <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                        En cumplimiento a lo dispuesto por la ley federal de
                        protección de datos personales en posesión de los
                        particulares y su reglamento.
                      </p>
                    </div>
                  </div>
                  <ScrollArea className="h-[600px] w-full border rounded-md mt-8">
                    <div className="p-4 text-sm space-y-6">
                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Introducción
                        </h2>
                        <p>
                          PawPal, con domicilio en Barrio San Felipe, calle
                          Vicente Guerrero 3, Tila, Chiapas, México, C.P. 29910,
                          es el responsable del uso y protección de sus datos
                          personales, que sean para la contratación del servicio
                          o de la información que usted mismo llegue a capturar
                          a través del formulario que se encuentra en la página
                          de Internet de PawPal: https://www.pawpal.site/.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Datos recabados y su uso
                        </h2>
                        <p>
                          Los datos que se recabarán consisten en:
                          <span className="font-medium">
                            Nombre completo, Dirección, Teléfono, Correo
                            electrónico, Ubicación, Nombre del canino, Edad y
                            Enfermedades
                          </span>
                          , los cuales serán utilizados para:
                        </p>
                        <ul className="list-disc pl-6 mt-2">
                          <li>
                            Proveer el servicio que usted está contratando
                          </li>
                          <li>
                            Notificarle sobre cambios de último momento en el
                            servicio contratado
                          </li>
                          <li>
                            Comprobar su identidad en caso de extravío de la
                            nota que ampara el servicio contratado
                          </li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Uso adicional de la información
                        </h2>
                        <p>
                          De manera adicional, utilizaremos su información
                          personal para las siguientes finalidades:
                        </p>
                        <ul className="list-disc pl-6 mt-2">
                          <li>
                            Evaluación de la calidad del servicio que le
                            brindamos
                          </li>
                          <li>
                            Informarle sobre la prestación de nuevos servicios y
                            productos
                          </li>
                          <li>Notificarle sobre nuevas promociones</li>
                          <li>
                            Integración de estadísticas sobre hábitos de consumo
                            en el mercado
                          </li>
                        </ul>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Oposición al uso adicional
                        </h2>
                        <p>
                          En caso de que no esté de acuerdo que sus datos
                          personales sean tratados para los fines adicionales
                          citados con anterioridad, requerirá enviar una
                          solicitud por escrito correo electrónico a la cuenta
                          PawPal88@gmail.com con asunto "Información personal"
                          en donde deberá proporcionar la siguiente información
                          en formato electrónico:
                        </p>
                        <ul className="list-disc pl-6 mt-2">
                          <li>
                            Nombre de la empresa, persona física o moral que
                            solicita la privacidad de su información.
                          </li>
                          <li>
                            Escrito breve que solicite la privacidad de su
                            información.
                          </li>
                        </ul>
                        <p className="mt-2">
                          En caso de no recibir la información previamente
                          mencionada, PawPal podrá a su exclusiva discreción
                          hacer caso omiso de su petición en tanto no subsane
                          las omisiones en la información requerida. Si el
                          peticionario envía toda la información solicitada,
                          igualmente, Demo a su exclusiva discreción, podrá
                          solicitar información adicional para corroborar la
                          personalidad legal sea acreditada conforme a los
                          cánones legales aplicables.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Derechos ARCO
                        </h2>
                        <p>
                          En términos de la Ley, usted podrá en cualquier
                          momento ejercitar sus derechos de acceso,
                          rectificación, cancelación y/u oposición, o revocar su
                          consentimiento para utilizar sus datos personales en
                          términos de este Aviso de Privacidad.
                        </p>
                        <p className="mt-2">
                          Para ello podrá contactar a nuestro Departamento de
                          Privacidad a través de la cuenta de correo electrónico
                          PawPal88@gmail.com.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Registro público de consumidores
                        </h2>
                        <p>
                          Con la finalidad de que Usted pueda limitar el uso y
                          divulgación de sus datos personales, puede inscribirse
                          directamente en el Registro Público de Consumidores
                          previsto en la Ley Federal de Protección al
                          Consumidor.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Uso de cookies y tecnologías de rastreo
                        </h2>
                        <p>
                          Le informamos que en nuestra página de Internet
                          utilizamos cookies, web beacons y otras tecnologías a
                          través de las cuales es posible monitorear su
                          comportamiento como usuario de Internet, así como
                          establecer contacto con usted cuando ingrese a la
                          sección de Contacto y llene el formulario con sus
                          datos personales. Los datos personales que obtenemos a
                          través de estas tecnologías de rastreo son los
                          siguientes: nombre, dirección de correo electrónico,
                          teléfono y domicilio, mismos que utilizaremos para
                          recibir sus dudas o comentarios relacionados con los
                          servicios que Demo presta al público en general.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Modificaciones al aviso de privacidad
                        </h2>
                        <p>
                          PawPal se reserva el derecho a modificar este Aviso de
                          Privacidad. En caso de presentarse cualquier cambio al
                          mismo, se notificará a través de la página de Internet
                          https://www.pawpal.site/ en el apartado de Aviso de
                          Privacidad.
                        </p>
                      </section>

                      <section>
                        <h2 className="text-xl font-semibold mb-2">
                          Cumplimiento legal
                        </h2>
                        <p>
                          Sus datos personales serán tratados en cumplimiento
                          con los niveles de seguridad requeridos por la Ley
                          Federal de Protección de Datos Personales en Posesión
                          de Particulares.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>

                  <div className="flex justify-center mt-28">
                    <Button variant={"ringHover"}>
                      Al continuar acepto el aviso de privacidad
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
