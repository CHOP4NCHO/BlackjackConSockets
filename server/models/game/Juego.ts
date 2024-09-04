import { Jugador } from "./Jugador";
import Carta, { Valor } from "../cards/Carta";
import { Mazo } from "../cards/Mazo";

export class Juego {
  public jugadores: Jugador[];
  public turno: number;
  public ronda: number;

  public mazo: Mazo;
  public manoGrupier: Carta[];
  public jugadoresGanadores: Jugador[];

  constructor() {
    this.jugadores = [];
    this.turno = 0;
    this.ronda = 0;
    this.mazo = new Mazo();
    this.manoGrupier = [];
    this.jugadoresGanadores = [];
    this.mazo.revolver();
  }

  public getJugadorActivo(): Jugador {
    return this.jugadores[this.turno];
  }

  public getPuntajeJA(): number {
    return this.calcularPuntaje(this.getJugadorActivo().mano);
  }

  public puedeSeguirPidiendoJA(): boolean {
    return this.calcularPuntaje(this.getJugadorActivo().mano) < 21;
  }

  public calcularPuntaje(cartas: Carta[]): number {
    const cartasAs: Carta[] = [];
    let contador = 0;
    cartas.forEach((carta) => {
      contador += carta.valor.valueOf();
      if (carta.valor == Valor.AS) cartasAs.push(carta);
    });
    if (cartasAs.length == 0) return contador;
    return contador - 10;
  }

  public entregarManoInicial() {
    this.manoGrupier.push(this.mazo.sacarCarta());

    this.jugadores.forEach((jugador: Jugador) => {
      jugador.mano.push(this.mazo.sacarCarta());
      jugador.mano.push(this.mazo.sacarCarta());
      jugador.puntaje = this.calcularPuntaje(jugador.mano);
    });
  }

  public avanzarRonda() {
    this.turno = 0;
    this.ronda++;
    this.jugadores.forEach( (j) =>  {
      j.puntaje = 0
      j.mano = []
    })
    this.manoGrupier = []
    this.jugadoresGanadores = [];
    this.entregarManoInicial();
  }

  public terminarRonda() {
    while (this.calcularPuntaje(this.manoGrupier) < 17) {
      this.manoGrupier.push(this.mazo.sacarCarta());
    }

    const puntajeGrupier = this.calcularPuntaje(this.manoGrupier);
    this.jugadores.forEach((jugador) => {
      const puntajeJugador = this.calcularPuntaje(jugador.mano);
      if (
        ((puntajeJugador > puntajeGrupier && puntajeJugador <= 21) ||
        (puntajeGrupier > 21 && puntajeJugador <= 21))
      ) {
        this.jugadoresGanadores.push(jugador);
      }
    });


  }

  public avanzarTurno() {
    this.turno++;
  }

  public entregarCartaJugadorActual(): void {
    //saca carta del mazo y envía a jugador
    this.getJugadorActivo().mano.push(this.mazo.sacarCarta());
  }

  public obtenerEstadoJuego(): EstadoJuego {
    return {
      turno: this.turno,
      ronda: this.ronda,
      nombreJugadorActivo: this.getJugadorActivo()?.nombre,
      jugadores: this.jugadores,
      jugadoresGanadores: this.jugadoresGanadores,
      manoGrupier: this.manoGrupier,
      puntajeGrupier: this.calcularPuntaje(this.manoGrupier),
    } as EstadoJuego;
  }
}

interface EstadoJuego {
  turno: number;
  ronda: number;
  puntajeGrupier: number;
  manoGrupier: Carta[];
  nombreJugadorActivo: string;
  jugadores: Jugador[];
  jugadoresGanadores: Jugador[];
}
