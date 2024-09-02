import Carta from "../cards/Carta";


export class Jugador {
    nombre: string;
    mano: Carta[];
    puntaje: number;

    public agregarCarta(carta: Carta) {
        this.mano.push(carta)
        
    }
}