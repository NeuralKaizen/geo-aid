"use client";

import { useId, type ReactNode } from "react";
import { Check } from "lucide-react";
import { fieldBox } from "@/components/ui/styles";

/** Etiqueta, ayuda y error alrededor de un control. El control recibe el id por render prop. */
export function Field({
  label,
  hint,
  error,
  optional = false,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-ayuda`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[14px] font-semibold text-tinta">
        {label}
        {optional && <span className="text-[12px] font-normal text-niebla">Opcional</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] leading-snug text-niebla">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-[13px] font-medium leading-snug text-alerta">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBox} h-12 ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${fieldBox} resize-none py-3 leading-relaxed ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${fieldBox} h-12 cursor-pointer appearance-none pr-10 ${props.className ?? ""}`}>
        {children}
      </select>
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-niebla"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </span>
  );
}

/**
 * Opción grande que se marca con un clic (radio o checkbox). Se usa para elegir destino, necesidades, métodos, etc.
 * El input real queda accesible; la tarjeta solo es su etiqueta.
 */
export function ChoiceCard({
  type = "radio",
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
  aside,
  className = "",
}: {
  type?: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-inset transition-[box-shadow,background-color] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-maiz-400 ${
        checked ? "bg-bosque-50/60 ring-2 ring-bosque-600" : "ring-linea hover:ring-bosque-200"
      } ${className}`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      {icon && (
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${
            checked ? "bg-bosque-800 text-white" : "bg-papel text-bosque-700"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug text-tinta">{title}</span>
        {description && <span className="mt-0.5 block text-[13px] leading-snug text-niebla">{description}</span>}
      </span>
      {aside}
      <span
        aria-hidden
        className={`grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
          checked ? "bg-bosque-800 text-white" : "ring-1 ring-inset ring-linea"
        } ${type === "checkbox" ? "rounded-md" : ""}`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
    </label>
  );
}

/** Botón de filtro que se prende y se apaga. */
export function FilterChip({
  pressed,
  onClick,
  children,
  count,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors duration-300 ${
        pressed ? "bg-bosque-800 text-white" : "bg-white text-tinta/80 ring-1 ring-inset ring-linea hover:ring-bosque-200"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`text-[12px] tabular-nums ${pressed ? "text-white/70" : "text-niebla"}`}>{count}</span>
      )}
    </button>
  );
}

/** Marca visible para todo lo que es de ejemplo. */
export function ExampleTag({ children = "Ejemplo", tone = "light" }: { children?: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
        tone === "light" ? "bg-maiz-100 text-maiz-800" : "bg-white/12 text-white/80"
      }`}
    >
      {children}
    </span>
  );
}
