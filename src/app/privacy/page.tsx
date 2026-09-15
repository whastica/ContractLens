import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AtmosphericBackground } from "@/components/shared/AtmosphericBackground";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <AtmosphericBackground />

      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-28 pb-20">
        <h1 className="font-heading text-3xl font-700 mb-2">
          Politica de Privacidad
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Ultima actualizacion: Septiembre 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              1. Informacion que Recopilamos
            </h2>
            <p className="text-muted-foreground">
              Para proporcionar nuestro servicio, recopilamos la siguiente informacion:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Cuenta:</strong> nombre y correo electronico,
                gestionados a traves de nuestro proveedor de autenticacion (Clerk).
              </li>
              <li>
                <strong className="text-foreground">Contratos:</strong> archivos PDF o DOCX que
                subes y el texto extraido de ellos para realizar el analisis.
              </li>
              <li>
                <strong className="text-foreground">Resultados:</strong> analisis generados,
                clausulas identificadas, hallazgos y recomendaciones.
              </li>
              <li>
                <strong className="text-foreground">Uso del servicio:</strong> datos de navegacion
                basicos para mejorar la experiencia.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              2. Como Usamos tu Informacion
            </h2>
            <p className="text-muted-foreground">
              Utilizamos tu informacion exclusivamente para:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Proporcionar el servicio de analisis contractual</li>
              <li>Guardar tu historial de analisis para acceso posterior</li>
              <li>Mostrar estadisticas en tu dashboard personal</li>
              <li>Mejorar la calidad y funcionalidad del servicio</li>
              <li>Comunicarnos contigo sobre tu cuenta o el servicio</li>
            </ul>
            <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <p className="text-green-400 font-medium text-xs">
                NO utilizamos tus contratos ni resultados para entrenar modelos de inteligencia
                artificial. NO vendemos ni compartimos tu informacion con terceros con fines
                comerciales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              3. Almacenamiento y Seguridad
            </h2>
            <p className="text-muted-foreground">
              Tus datos se almacenan de forma segura usando Supabase (PostgreSQL) con las
              siguientes medidas de proteccion:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Row Level Security (RLS): cada usuario solo puede acceder a sus propios datos</li>
              <li>Encriptacion en transito mediante HTTPS/TLS</li>
              <li>Acceso restringido a la base de datos mediante credenciales seguras</li>
              <li>Aislamiento completo entre cuentas de usuarios</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              4. Retencion de Datos
            </h2>
            <p className="text-muted-foreground">
              Conservamos tus contratos, analisis y resultados mientras tu cuenta este activa.
              Puedes eliminar tu cuenta y todos tus datos asociados en cualquier momento
              solicitandolo a traves de notre pagina de contacto. Los datos de facturacion
              se retienen segun la normativa tributaria aplicable en Colombia.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              5. Compartir Informacion
            </h2>
            <p className="text-muted-foreground">
              ContractLens NO comparte tu informacion personal con terceros, excepto en
              los siguientes casos:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Proveedores esenciales:</strong> Clerk
                (autenticacion), Supabase (base de datos) y OpenAI (procesamiento de IA).
                Estos proveedores solo acceden a la informacion estrictamente necesaria
                para proporcionar sus servicios.
              </li>
              <li>
                <strong className="text-foreground">Requerimiento legal:</strong> cuando sea
                obligatorio por ley, orden judicial o autoridad competente.
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              El texto de tus contratos se envia a OpenAI exclusivamente para realizar el
              analisis. OpenAI no almacena permanentemente las entradas para entrenar sus
              modelos segun su politica actual.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              ContractLens utiliza unicamente cookies esenciales para el funcionamiento
              del servicio, especificamente para mantener tu sesion de inicio de sesion
              a traves de Clerk. No utilizamos cookies de rastreo publicitario ni de
              analisis de terceros. Puedes gestionar las cookies de tu navegador en
              cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              7. Tus Derechos
            </h2>
            <p className="text-muted-foreground">
              Conforme a la Ley 1581 de 2012 de Proteccion de Datos Personales en Colombia,
              tienes derecho a:
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>Conocer, actualizar y rectificar tus datos personales</li>
              <li>Solicitar prueba de la autorizacion otorgada</li>
              <li>Ser informado sobre el uso de tus datos</li>
              <li>Revocar la autorizacion y/o solicitar la supresion de tus datos</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Para ejercer estos derechos, contactanos a traves de nuestra pagina de{" "}
              <a href="/contact" className="text-primary hover:underline">
                contacto
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              8. Menores de Edad
            </h2>
            <p className="text-muted-foreground">
              ContractLens no esta dirigido a menores de 18 anos. No recopilamos
              intencionalmente informacion personal de menores de edad. Si descubrimos
              que un menor de edad ha proporcionado informacion personal, tomaremos
              medidas para eliminar dicha informacion.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              9. Cambios en esta Politica
            </h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de actualizar esta Politica de Privacidad en
              cualquier momento. Los cambios significativos seran notificados a traves
              del servicio o por correo electronico. Te recomendamos revisar periodicamente
              esta politica.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-600 mb-3">
              10. Contacto
            </h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre esta Politica de Privacidad o deseas ejercer
              tus derechos de proteccion de datos, puedes contactarnos a traves de
              nuestra pagina de{" "}
              <a href="/contact" className="text-primary hover:underline">
                contacto
              </a>.
            </p>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
