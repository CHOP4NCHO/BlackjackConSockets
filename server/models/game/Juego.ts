import {Jugador} from "./Jugador";
import Carta, {Valor} from "../cards/Carta";
import {Mazo} from "../cards/Mazo";

export class Juego {
    public jugadores: Jugador[];
    public turno: number;
    public ronda: number;

    public mazo: Mazo;
    public manoGrupier: Carta[];
    private jugadoresGanadores: Jugador[];

    constructor () {
        this.jugadores = [];
        this.turno = 0;
        this.ronda = 0;
        this.mazo = new Mazo();
        this.manoGrupier = [];
        this.jugadoresGanadores = [];
    }
    public getJugadorActivo(): Jugador {
        return this.jugadores[this.turno];
    }

    public checkearPuntaje (): boolean {
        return this.calcularPuntaje(this.getJugadorActivo()) <= 21
    }
    public calcularPuntaje(jugador: Jugador): number {
        const cartasAs: Carta[] = []
        let contador = 0;
        jugador.mano.forEach(
            (carta, index) => {
                contador += carta.valor.valueOf()
                if (carta.valor == Valor.AS)
                    cartasAs.push(carta);
            }
        )
        if (cartasAs.length == 0)
            return contador;
        return contador-10;

    }
    public entregarManoInicial() {
        this.jugadores.forEach(
            (jugador: Jugador) => {

            }
        )
    }
    public avanzarRonda() {
        this.ronda++;
        this.turno = 0;
    }
    public terminarRonda() {
        /*acaba llenando mano del grupier.
        si se pasa de 21 ganan los que tengan que ganar*/
        this.avanzarRonda();
    }
    public avanzarTurno () {
        this.turno = this.turno+1 % this.jugadores.length;
        //apunta al siguiente jugador

    }
    public entregarCarta(): void {
        //saca carta del mazo y envía a jugador
        this.getJugadorActivo().mano.push(this.mazo.sacarCarta());

    }

    public obtenerEstadoJuego(): EstadoJuego {
        return {
            turno: this.turno,
            ronda: this.ronda,
            nombreJugadorActivo: this.getJugadorActivo().nombre,
            jugadores: this.jugadores,
            jugadoresGanadores: this.jugadoresGanadores
        } as EstadoJuego
    }




}
interface EstadoJuego {
    turno: number,
    ronda: number,
    nombreJugadorActivo: string;
    jugadores: Jugador[];
    jugadoresGanadores: Jugador[];
}