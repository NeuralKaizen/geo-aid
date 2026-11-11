"use client";

import { ChoiceCard, Field, Select, TextArea, TextInput } from "@/components/ui/form";
import { departamentos, relaciones } from "@/content/desaparecidos";
import { useTodayKey } from "@/lib/dates";

/* Los tres pasos del reporte: datos, validación y campos. El contenedor (report-form.tsx) maneja la navegación. */

export type ReportData = {
  nombre: string;
  edad: string;
  rasgos: string;
  ropa: string;
  departamento: string;
  municipio: string;
  lugar: string;
  fecha: string;
  tuNombre: string;
  relacion: string;
  celular: string;
  consentimiento: boolean;
};

export type ReportErrors = Partial<Record<keyof ReportData, string>>;

export const emptyReport: ReportData = {
  nombre: "",
  edad: "",
  rasgos: "",
  ropa: "",
  departamento: "",
  municipio: "",
  lugar: "",
  fecha: "",
  tuNombre: "",
  relacion: "",
  celular: "",
  consentimiento: false,
};

export const stepNames = ["La persona", "Dónde y cuándo", "Tus datos"];

const digits = (value: string) => value.replace(/\D/g, "");

/** Errores del paso indicado. `today` (AAAA-MM-DD) solo se calcula al validar, nunca durante el render. */
export function validateStep(step: number, data: ReportData, today: string): ReportErrors {
  const errors: ReportErrors = {};
  if (step === 0) {
    if (data.nombre.trim().length < 3) errors.nombre = "Escribe el nombre de la persona, como la conocen.";
    const age = Number(data.edad);
    if (!/^\d{1,3}$/.test(data.edad.trim()) || age > 110) errors.edad = "Escribe la edad en años. Si no la sabes, una aproximada.";
    if (data.rasgos.trim().length < 10) errors.rasgos = "Cuéntanos algo que ayude a reconocerla: estatura, cabello, señas.";
  }
  if (step === 1) {
    if (!data.departamento) errors.departamento = "Elige el departamento.";
    if (data.municipio.trim().length < 2) errors.municipio = "Escribe el municipio.";
    if (data.lugar.trim().length < 3) errors.lugar = "Escribe dónde la vieron por última vez, aunque sea aproximado.";
    if (!data.fecha) errors.fecha = "Elige la fecha en que la vieron por última vez.";
    else if (data.fecha > today) errors.fecha = "La fecha no puede ser posterior a hoy.";
  }
  if (step === 2) {
    if (data.tuNombre.trim().length < 3) errors.tuNombre = "Escribe tu nombre.";
    if (!data.relacion) errors.relacion = "Elige tu relación con la persona.";
    if (!/^3\d{9}$/.test(digits(data.celular))) errors.celular = "Escribe un celular de 10 dígitos, por ejemplo 300 123 4567.";
    if (!data.consentimiento) errors.consentimiento = "Necesitamos tu autorización para publicar el reporte.";
  }
  return errors;
}

type StepProps = {
  data: ReportData;
  errors: ReportErrors;
  set: <K extends keyof ReportData>(field: K, value: ReportData[K]) => void;
};

export function PersonStep({ data, errors, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
        <Field label="Nombre completo" error={errors.nombre} hint="Al publicar solo mostramos el nombre y la inicial del apellido.">
          {(props) => (
            <TextInput {...props} name="nombre" autoComplete="off" value={data.nombre} onChange={(event) => set("nombre", event.target.value)} />
          )}
        </Field>
        <Field label="Edad" error={errors.edad}>
          {(props) => (
            <TextInput
              {...props}
              name="edad"
              inputMode="numeric"
              maxLength={3}
              placeholder="Años"
              value={data.edad}
              onChange={(event) => set("edad", event.target.value)}
            />
          )}
        </Field>
      </div>
      <Field label="¿Cómo es?" error={errors.rasgos} hint="Estatura, contextura, color y largo del cabello, cicatrices, lunares o tatuajes.">
        {(props) => <TextArea {...props} name="rasgos" rows={3} value={data.rasgos} onChange={(event) => set("rasgos", event.target.value)} />}
      </Field>
      <Field label="¿Qué ropa llevaba?" optional>
        {(props) => (
          <TextArea
            {...props}
            name="ropa"
            rows={2}
            placeholder="Por ejemplo: chaqueta azul, botas de caucho"
            value={data.ropa}
            onChange={(event) => set("ropa", event.target.value)}
          />
        )}
      </Field>
    </div>
  );
}

export function PlaceStep({ data, errors, set }: StepProps) {
  const today = useTodayKey();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Departamento" error={errors.departamento}>
          {(props) => (
            <Select {...props} name="departamento" value={data.departamento} onChange={(event) => set("departamento", event.target.value)}>
              <option value="">Elige uno</option>
              {departamentos.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Municipio" error={errors.municipio}>
          {(props) => (
            <TextInput {...props} name="municipio" value={data.municipio} onChange={(event) => set("municipio", event.target.value)} />
          )}
        </Field>
      </div>
      <Field label="Lugar donde la vieron por última vez" error={errors.lugar} hint="Un lugar público de referencia: un parque, una vereda, un albergue.">
        {(props) => <TextInput {...props} name="lugar" value={data.lugar} onChange={(event) => set("lugar", event.target.value)} />}
      </Field>
      <div className="sm:max-w-[16rem]">
        <Field label="Fecha" error={errors.fecha}>
          {(props) => (
            <TextInput
              {...props}
              type="date"
              name="fecha"
              max={today ?? undefined}
              value={data.fecha}
              onChange={(event) => set("fecha", event.target.value)}
            />
          )}
        </Field>
      </div>
    </div>
  );
}

export function ContactStep({ data, errors, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tu nombre" error={errors.tuNombre}>
          {(props) => (
            <TextInput {...props} name="tuNombre" autoComplete="name" value={data.tuNombre} onChange={(event) => set("tuNombre", event.target.value)} />
          )}
        </Field>
        <Field label="Tu relación con la persona" error={errors.relacion}>
          {(props) => (
            <Select {...props} name="relacion" value={data.relacion} onChange={(event) => set("relacion", event.target.value)}>
              <option value="">Elige una</option>
              {relaciones.map((relacion) => (
                <option key={relacion} value={relacion}>
                  {relacion}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field label="Tu celular" error={errors.celular} hint="Para avisarte si alguien deja una pista. No se publica.">
        {(props) => (
          <TextInput
            {...props}
            type="tel"
            name="celular"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="300 123 4567"
            value={data.celular}
            onChange={(event) => set("celular", event.target.value)}
            className="sm:max-w-[16rem]"
          />
        )}
      </Field>
      <div>
        <ChoiceCard
          type="checkbox"
          name="consentimiento"
          value="si"
          checked={data.consentimiento}
          onChange={(checked) => set("consentimiento", checked)}
          title="Autorizo publicar el reporte"
          description="Con el nombre y la inicial del apellido, la edad, el municipio y dónde la vieron. Nunca con mis datos."
          className={errors.consentimiento ? "!ring-2 !ring-alerta" : ""}
        />
        {errors.consentimiento && (
          <p role="alert" className="mt-1.5 text-[13px] font-medium leading-snug text-alerta">
            {errors.consentimiento}
          </p>
        )}
      </div>
    </div>
  );
}
