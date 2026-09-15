import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AtmosphericBackground } from "@/components/shared/AtmosphericBackground";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <AtmosphericBackground />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-20">
        <h1 className="font-heading text-3xl font-700 mb-2">
          Terminos de Servicio
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Ultima actualizacion: Septiembre 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              1. Aceptacion de Terminos
            </h2>
            <p className="text-muted-foreground">
              Al acceder y utilizar ContractLens, aceptas estos Terminos de Servicio.
              Si no estas de acuerdo con alguno de estos terminos, no debes utilizar el servicio.
              Nos reservamos el derecho de modificar estos terminos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              2. Descripcion del Servicio
            </h2>
            <p className="text-muted-foreground">
              ContractLens es una plataforma de analisis y preauditoria contractual asistida
              por inteligencia artificial. El servicio permite a usuarios subir contratos para
              obtener un analisis preliminar que incluye identificacion de tipo de contrato,
              extraccion de clausulas, analisis de riesgos y recomendaciones.
            </p>
            <div className="mt-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
              <p className="text-accent font-medium text-xs">
                IMPORTANTE: ContractLens constituye un analisis preliminar asistido por IA.
                No sustituye ni reemplaza la asesoria juridica profesional. La decision
                final sobre cualquier contrato siempre debe ser tomada por un abogado
                calificado.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              3. Registro y Cuenta
            </h2>
            <p className="text-muted-foreground">
              Para utilizar ContractLens debes crear una cuenta a traves de nuestro proveedor
              de autenticacion (Clerk). Eres responsable de mantener la confidencialidad de
              tus credenciales y de todas las actividades que ocurran en tu cuenta. Debes ser
              mayor de 18 anos para crear una cuenta.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              4. Uso Aceptable
            </h2>
            <p className="text-muted-foreground">
              Al utilizar ContractLens, te comprometes a:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Subir unicamente contratos que tengas derecho legal a analizar</li>
              <li>No utilizar el servicio para fines ilicitos o no autorizados</li>
              <li>No intentar vulnerar o evadir las medidas de seguridad del sistema</li>
              <li>No reproducir, duplicar o revender el servicio sin autorizacion</li>
              <li>No utilizar los resultados para asesorar a terceros sin ser abogado habilitado</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              5. Propiedad Intelectual
            </h2>
            <p className="text-muted-foreground">
              ContractLens es titular de todos los derechos de propiedad intelectual sobre
              la plataforma, su codigo fuente, diseno, marca y demas elementos propios del
              servicio. Los usuarios conservan la titularidad sobre los contratos que suben
              y los resultados generados por el analisis. Se otorga una licencia limitada,
              no exclusiva e intransferible para usar el servicio conforme a estos terminos.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              6. Disclaimers y Limitaciones
            </h2>
            <p className="text-muted-foreground">
              El servicio se proporciona &quot;tal cual&quot; y &quot;segun disponibilidad&quot;.
              No garantizamos que el analisis sea completo, preciso o libre de errores.
              Los resultados dependen de la calidad y claridad del texto del contrato proporcionado.
              No consideramos circunstancias externas, negociaciones previas o intenciones de
              las partes que no aparezcan en el documento.
            </p>
            <p className="mt-2 text-muted-foreground">
              En ningun caso ContractLens sera responsable por danos directos, indirectos,
              incidentales o consecuentes derivados del uso o imposibilidad de uso del servicio.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              7. Disponibilidad del Servicio
            </h2>
            <p className="text-muted-foreground">
              Nos esforzamos por mantener ContractLens disponible de forma continua, pero
              no garantizamos disponibilidad ininterrumpida. Podemos modificar, suspender
              o descontinuar el servicio total o parcialmente en cualquier momento sin previo
              aviso. No seremos responsables por ninguna modificacion, suspension o
              descontinuacion del servicio.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              8. Modificaciones
            </h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos terminos en cualquier momento.
              Los cambios significativos seran notificados a traves del servicio o por
              correo electronico. El uso continuado del servicio despues de los cambios
              constituye aceptacion de los nuevos terminos.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              9. Ley Aplicable y Jurisdiccion
            </h2>
            <p className="text-muted-foreground">
              Estos terminos se rigen por la legislacion de la Republica de Colombia.
              Cualquier controversia derivada de estos terminos o del uso del servicio
              sera sometida a la jurisdiccion de los tribunales competentes de Colombia.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              10. Contacto
            </h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre estos Terminos de Servicio, puedes contactarnos a
              traves de nuestra pagina de{" "}
              <a href="/contact" className="text-primary hover:underline">
                contacto
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
