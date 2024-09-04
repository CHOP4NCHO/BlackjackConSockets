import Carta, { Pinta, Valor } from "./Carta";

export class Mazo {
  public cartas: Carta[] = [];
  public _cartas: Carta[] = [
    new Carta(Pinta.PICA, Valor.AS, "A"),
    new Carta(Pinta.PICA, Valor.DOS, "2"),
    new Carta(Pinta.PICA, Valor.TRES, "3"),
    new Carta(Pinta.PICA, Valor.CUATRO, "4"),
    new Carta(Pinta.PICA, Valor.CINCO, "5"),
    new Carta(Pinta.PICA, Valor.SEIS, "6"),
    new Carta(Pinta.PICA, Valor.SIETE, "7"),
    new Carta(Pinta.PICA, Valor.OCHO, "8"),
    new Carta(Pinta.PICA, Valor.NUEVE, "9"),
    new Carta(Pinta.PICA, Valor.DIEZ, "T"),
    new Carta(Pinta.PICA, Valor.JOTA, "J"),
    new Carta(Pinta.PICA, Valor.QUINA, "Q"),
    new Carta(Pinta.PICA, Valor.KAISER, "K"),

    new Carta(Pinta.CORAZON, Valor.AS, "A"),
    new Carta(Pinta.CORAZON, Valor.DOS, "2"),
    new Carta(Pinta.CORAZON, Valor.TRES, "3"),
    new Carta(Pinta.CORAZON, Valor.CUATRO, "4"),
    new Carta(Pinta.CORAZON, Valor.CINCO, "5"),
    new Carta(Pinta.CORAZON, Valor.SEIS, "6"),
    new Carta(Pinta.CORAZON, Valor.SIETE, "7"),
    new Carta(Pinta.CORAZON, Valor.OCHO, "8"),
    new Carta(Pinta.CORAZON, Valor.NUEVE, "9"),
    new Carta(Pinta.CORAZON, Valor.DIEZ, "T"),
    new Carta(Pinta.CORAZON, Valor.JOTA, "J"),
    new Carta(Pinta.CORAZON, Valor.QUINA, "Q"),
    new Carta(Pinta.CORAZON, Valor.KAISER, "K"),

    new Carta(Pinta.TREBOL, Valor.AS, "A"),
    new Carta(Pinta.TREBOL, Valor.DOS, "2"),
    new Carta(Pinta.TREBOL, Valor.TRES, "3"),
    new Carta(Pinta.TREBOL, Valor.CUATRO, "4"),
    new Carta(Pinta.TREBOL, Valor.CINCO, "5"),
    new Carta(Pinta.TREBOL, Valor.SEIS, "6"),
    new Carta(Pinta.TREBOL, Valor.SIETE, "7"),
    new Carta(Pinta.TREBOL, Valor.OCHO, "8"),
    new Carta(Pinta.TREBOL, Valor.NUEVE, "9"),
    new Carta(Pinta.TREBOL, Valor.DIEZ, "T"),
    new Carta(Pinta.TREBOL, Valor.JOTA, "J"),
    new Carta(Pinta.TREBOL, Valor.QUINA, "Q"),
    new Carta(Pinta.TREBOL, Valor.KAISER, "K"),

    new Carta(Pinta.DIAMANTE, Valor.AS, "A"),
    new Carta(Pinta.DIAMANTE, Valor.DOS, "2"),
    new Carta(Pinta.DIAMANTE, Valor.TRES, "3"),
    new Carta(Pinta.DIAMANTE, Valor.CUATRO, "4"),
    new Carta(Pinta.DIAMANTE, Valor.CINCO, "5"),
    new Carta(Pinta.DIAMANTE, Valor.SEIS, "6"),
    new Carta(Pinta.DIAMANTE, Valor.SIETE, "7"),
    new Carta(Pinta.DIAMANTE, Valor.OCHO, "8"),
    new Carta(Pinta.DIAMANTE, Valor.NUEVE, "9"),
    new Carta(Pinta.DIAMANTE, Valor.DIEZ, "T"),
    new Carta(Pinta.DIAMANTE, Valor.JOTA, "J"),
    new Carta(Pinta.DIAMANTE, Valor.QUINA, "Q"),
    new Carta(Pinta.DIAMANTE, Valor.KAISER, "K"),
  ];

  constructor() {
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
    this.cartas.push(...this._cartas);
  }

  public revolver(): void {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  public sacarCarta(): Carta {
    return <Carta>this.cartas.pop();
  }
}
