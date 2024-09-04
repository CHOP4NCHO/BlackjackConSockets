import { Jugador } from "./Jugador";
import Carta from "../cards/Carta";
import { Mazo } from "../cards/Mazo";

export interface EstadoJuego {
  turno: number;
  ronda: number;
  puntajeGrupier: number;
  manoGrupier: Carta[];
  nombreJugadorActivo: string;
  jugadores: Jugador[];
  jugadoresGanadores: Jugador[];
}
