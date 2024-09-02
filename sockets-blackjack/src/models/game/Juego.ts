import { Jugador } from "@/models/game/Jugador";
import Carta from "@/models/cards/Carta";
import { Mazo } from "@/models/cards/Mazo";

export class Juego {
  public jugadores: Jugador[];

  public jugadorActivo: Jugador;
  public turno: number;
  public ronda: number;

  public mazo: Mazo;
  public manoGrupier: Carta[];
  private jugadoresGanadores: Jugador[];

  public checkearPuntaje(): boolean {
    return this.calcularPuntaje(this.jugadorActivo) <= 21;
  }
  public calcularPuntaje(jugador: Jugador): number {
    return 0;
    //return PUNTAJE
  }
  public entregarManoInicial() {}
  public avanzarRonda() {
    this.ronda++;
    this.turno = 0;
  }
  public terminarRonda() {
    /*acaba llenando mano del grupier.
        si se pasa de 21 ganan los que tengan que ganar*/
    this.avanzarRonda();
  }
  public avanzarTurno() {
    this.turno = this.turno + (1 % this.jugadores.length);
    //apunta al siguiente jugador
    this.jugadorActivo = this.jugadores[this.turno];
  }
  public entregarCarta(): void {
    //saca carta del mazo y envía a jugador

    this.jugadorActivo.mano.push(this.mazo.sacarCarta());
  }

  public obtenerEstadoJuego(): EstadoJuego {
    return {
      turno: this.turno,
      ronda: this.ronda,
      nombreJugadorActivo: this.jugadorActivo.nombre,
      jugadores: this.jugadores,
      jugadoresGanadores: this.jugadoresGanadores,
    } as EstadoJuego;
  }
}
export interface EstadoJuego {
  turno: number;
  ronda: number;
  nombreJugadorActivo: string;
  jugadores: Jugador[];
  jugadoresGanadores: Jugador[];
}
