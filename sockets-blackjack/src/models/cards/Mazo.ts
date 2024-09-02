import Carta, { CardSuite, CardValue } from "@/models/cards/Carta";

export class Mazo {
  public cartas: Carta[] = [
    new Carta(CardSuite.PICA, CardValue.AS),
    new Carta(CardSuite.PICA, CardValue.DOS),
    new Carta(CardSuite.PICA, CardValue.TRES),
    new Carta(CardSuite.PICA, CardValue.CUATRO),
    new Carta(CardSuite.PICA, CardValue.CINCO),
    new Carta(CardSuite.PICA, CardValue.SEIS),
    new Carta(CardSuite.PICA, CardValue.SIETE),
    new Carta(CardSuite.PICA, CardValue.OCHO),
    new Carta(CardSuite.PICA, CardValue.NUEVE),
    new Carta(CardSuite.PICA, CardValue.DIEZ),
    new Carta(CardSuite.PICA, CardValue.JOTA),
    new Carta(CardSuite.PICA, CardValue.QUINA),
    new Carta(CardSuite.PICA, CardValue.KAISER),

    new Carta(CardSuite.CORAZON, CardValue.AS),
    new Carta(CardSuite.CORAZON, CardValue.DOS),
    new Carta(CardSuite.CORAZON, CardValue.TRES),
    new Carta(CardSuite.CORAZON, CardValue.CUATRO),
    new Carta(CardSuite.CORAZON, CardValue.CINCO),
    new Carta(CardSuite.CORAZON, CardValue.SEIS),
    new Carta(CardSuite.CORAZON, CardValue.SIETE),
    new Carta(CardSuite.CORAZON, CardValue.OCHO),
    new Carta(CardSuite.CORAZON, CardValue.NUEVE),
    new Carta(CardSuite.CORAZON, CardValue.DIEZ),
    new Carta(CardSuite.CORAZON, CardValue.JOTA),
    new Carta(CardSuite.CORAZON, CardValue.QUINA),
    new Carta(CardSuite.CORAZON, CardValue.KAISER),

    new Carta(CardSuite.TREBOL, CardValue.AS),
    new Carta(CardSuite.TREBOL, CardValue.DOS),
    new Carta(CardSuite.TREBOL, CardValue.TRES),
    new Carta(CardSuite.TREBOL, CardValue.CUATRO),
    new Carta(CardSuite.TREBOL, CardValue.CINCO),
    new Carta(CardSuite.TREBOL, CardValue.SEIS),
    new Carta(CardSuite.TREBOL, CardValue.SIETE),
    new Carta(CardSuite.TREBOL, CardValue.OCHO),
    new Carta(CardSuite.TREBOL, CardValue.NUEVE),
    new Carta(CardSuite.TREBOL, CardValue.DIEZ),
    new Carta(CardSuite.TREBOL, CardValue.JOTA),
    new Carta(CardSuite.TREBOL, CardValue.QUINA),
    new Carta(CardSuite.TREBOL, CardValue.KAISER),

    new Carta(CardSuite.DIAMANTE, CardValue.AS),
    new Carta(CardSuite.DIAMANTE, CardValue.DOS),
    new Carta(CardSuite.DIAMANTE, CardValue.TRES),
    new Carta(CardSuite.DIAMANTE, CardValue.CUATRO),
    new Carta(CardSuite.DIAMANTE, CardValue.CINCO),
    new Carta(CardSuite.DIAMANTE, CardValue.SEIS),
    new Carta(CardSuite.DIAMANTE, CardValue.SIETE),
    new Carta(CardSuite.DIAMANTE, CardValue.OCHO),
    new Carta(CardSuite.DIAMANTE, CardValue.NUEVE),
    new Carta(CardSuite.DIAMANTE, CardValue.DIEZ),
    new Carta(CardSuite.DIAMANTE, CardValue.JOTA),
    new Carta(CardSuite.DIAMANTE, CardValue.QUINA),
    new Carta(CardSuite.DIAMANTE, CardValue.KAISER),
  ];

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
