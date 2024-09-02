export enum Pinta {
    PICA ,
    CORAZON,
    TREBOL,
    DIAMANTE
}
export enum Valor {
    AS ,
    DOS,
    TRES,
    CUATRO,
    CINCO,
    SEIS,
    SIETE,
    OCHO,
    NUEVE,
    DIEZ,
    JOTA,
    QUINA,
    KAISER
}



export default class Carta {
    public pinta: Pinta
    public valor: Valor
    public visible: boolean = false;


    constructor(pinta: Pinta, valor: Valor) {
        this.pinta = pinta;
        this.valor = valor;
    }

    public
}
