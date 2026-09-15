"use client";

import { useState } from "react";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AtmosphericBackground } from "@/components/shared/AtmosphericBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, Clock, MapPin, CheckCircle, Send } from "lucide-react";

const subjectOptions = [
  "General",
  "Soporte tecnico",
  "Facturacion",
  "Sugerencia de mejora",
  "Otro",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <AtmosphericBackground />

      <main className="relative z-10 mx-auto max-w-2xl px-6 pt-28 pb-20">
        <h1 className="font-heading text-3xl font-700 mb-2">
          Contacto
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          ¿Tienes preguntas? Escríbanos.
        </p>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="h-7 w-7 text-green-400" />
                </div>
                <h2 className="font-heading text-xl font-600 mb-2">
                  Mensaje enviado
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Gracias por contactarnos. Responderemos lo antes posible.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "General", message: "" });
                  }}
                >
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electronico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aqui..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  <Send className="h-4 w-4" />
                  Enviar mensaje
                </Button>
              </form>
            )}

            <Separator className="my-6" />

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Correo</p>
                  <p className="text-sm">soporte@contractlens.co</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Horario</p>
                  <p className="text-sm">Lun - Vie, 9am - 6pm</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ubicacion</p>
                  <p className="text-sm">Colombia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MarketingFooter />
    </div>
  );
}
