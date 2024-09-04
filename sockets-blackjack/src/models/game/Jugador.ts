import Carta from "../cards/Carta";

export class Jugador {
  nombre: string = "";
  mano: Carta[] = [];
  puntaje: number = 0;

  public agregarCarta(carta: Carta) {
    this.mano.push(carta);
  }
}
