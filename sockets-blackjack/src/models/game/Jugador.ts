import Carta from "@/models/cards/Carta";

export interface Jugador {
  nombre: string;
  mano: Carta[];
}
