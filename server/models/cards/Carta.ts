export enum Pinta {
  PICA = "S",
  CORAZON = "H",
  TREBOL = "C",
  DIAMANTE = "D",
  REVERSO = "B",
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
  public valorNombre: string;

  constructor(pinta: Pinta, valor: Valor, valorNombre: string) {
    this.valorNombre = valorNombre;
    this.pinta = pinta;
    this.valor = valor;
  }
}
