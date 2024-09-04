export enum Pinta {
  PICA,
  CORAZON,
  TREBOL,
  DIAMANTE,
}
export enum Valor {
  AS = 11,
  DOS = 2,
  TRES = 3,
  CUATRO = 4,
  CINCO = 5,
  SEIS = 6,
  SIETE = 7,
  OCHO = 8,
  NUEVE = 9,
  DIEZ = 10,
  JOTA = 10,
  QUINA = 10,
  KAISER = 10,
}

export default class Carta {
  public pinta: Pinta;
  public valor: Valor;
  public visible: boolean = true;

  constructor(pinta: Pinta, valor: Valor) {
    this.pinta = pinta;
    this.valor = valor;
  }
}
