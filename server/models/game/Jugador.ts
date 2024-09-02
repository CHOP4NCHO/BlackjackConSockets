import Carta from "../cards/Carta";


export interface Jugador {
    nombre: string;
    mano: Carta[];
}