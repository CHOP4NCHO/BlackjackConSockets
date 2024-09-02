export enum CardSuite {
  PICA = "S",
  CORAZON = "H",
  TREBOL = "C",
  DIAMANTE = "D",
  REVERSO = "B",
}

export enum CardValue {
  UNO = "1",
  AS = "A",
  DOS = "2",
  TRES = "3",
  CUATRO = "4",
  CINCO = "5",
  SEIS = "6",
  SIETE = "7",
  OCHO = "8",
  NUEVE = "9",
  DIEZ = "T",
  JOTA = "J",
  QUINA = "Q",
  KAISER = "K",
}

export default class Carta {
  public pinta: CardSuite;
  public valor: CardValue;
  public visible: Boolean = false;

  constructor(pinta: CardSuite, valor: CardValue) {
    this.pinta = pinta;
    this.valor = valor;
  }
}

export const REVERSO_NEGRO: Carta = new Carta(CardSuite.REVERSO, CardValue.UNO);
export const REVERSO_ROJO: Carta = new Carta(CardSuite.REVERSO, CardValue.DOS);
