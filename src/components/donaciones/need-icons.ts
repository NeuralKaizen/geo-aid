import { BriefcaseMedical, Droplets, ShoppingBasket, SoapDispenserDroplet, Tent, type LucideIcon } from "lucide-react";
import type { NeedType } from "@/content/donaciones";

/** Un ícono por tipo de necesidad, el mismo en el tablero y en el pago */
export const needIcons: Record<NeedType, LucideIcon> = {
  agua: Droplets,
  alimentos: ShoppingBasket,
  aseo: SoapDispenserDroplet,
  refugio: Tent,
  salud: BriefcaseMedical,
};
