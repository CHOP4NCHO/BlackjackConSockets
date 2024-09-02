import Carta, {Pinta, Valor} from "./Carta";


export class Mazo {
    public cartas: Carta[] = [
        new Carta(Pinta.PICA, Valor.AS),
        new Carta(Pinta.PICA, Valor.DOS),
        new Carta(Pinta.PICA, Valor.TRES),
        new Carta(Pinta.PICA, Valor.CUATRO),
        new Carta(Pinta.PICA, Valor.CINCO),
        new Carta(Pinta.PICA, Valor.SEIS),
        new Carta(Pinta.PICA, Valor.SIETE),
        new Carta(Pinta.PICA, Valor.OCHO),
        new Carta(Pinta.PICA, Valor.NUEVE),
        new Carta(Pinta.PICA, Valor.DIEZ),
        new Carta(Pinta.PICA, Valor.JOTA),
        new Carta(Pinta.PICA, Valor.QUINA),
        new Carta(Pinta.PICA, Valor.KAISER),

        new Carta(Pinta.CORAZON, Valor.AS),
        new Carta(Pinta.CORAZON, Valor.DOS),
        new Carta(Pinta.CORAZON, Valor.TRES),
        new Carta(Pinta.CORAZON, Valor.CUATRO),
        new Carta(Pinta.CORAZON, Valor.CINCO),
        new Carta(Pinta.CORAZON, Valor.SEIS),
        new Carta(Pinta.CORAZON, Valor.SIETE),
        new Carta(Pinta.CORAZON, Valor.OCHO),
        new Carta(Pinta.CORAZON, Valor.NUEVE),
        new Carta(Pinta.CORAZON, Valor.DIEZ),
        new Carta(Pinta.CORAZON, Valor.JOTA),
        new Carta(Pinta.CORAZON, Valor.QUINA),
        new Carta(Pinta.CORAZON, Valor.KAISER),

        new Carta(Pinta.TREBOL, Valor.AS),
        new Carta(Pinta.TREBOL, Valor.DOS),
        new Carta(Pinta.TREBOL, Valor.TRES),
        new Carta(Pinta.TREBOL, Valor.CUATRO),
        new Carta(Pinta.TREBOL, Valor.CINCO),
        new Carta(Pinta.TREBOL, Valor.SEIS),
        new Carta(Pinta.TREBOL, Valor.SIETE),
        new Carta(Pinta.TREBOL, Valor.OCHO),
        new Carta(Pinta.TREBOL, Valor.NUEVE),
        new Carta(Pinta.TREBOL, Valor.DIEZ),
        new Carta(Pinta.TREBOL, Valor.JOTA),
        new Carta(Pinta.TREBOL, Valor.QUINA),
        new Carta(Pinta.TREBOL, Valor.KAISER),

        new Carta(Pinta.DIAMANTE, Valor.AS),
        new Carta(Pinta.DIAMANTE, Valor.DOS),
        new Carta(Pinta.DIAMANTE, Valor.TRES),
        new Carta(Pinta.DIAMANTE, Valor.CUATRO),
        new Carta(Pinta.DIAMANTE, Valor.CINCO),
        new Carta(Pinta.DIAMANTE, Valor.SEIS),
        new Carta(Pinta.DIAMANTE, Valor.SIETE),
        new Carta(Pinta.DIAMANTE, Valor.OCHO),
        new Carta(Pinta.DIAMANTE, Valor.NUEVE),
        new Carta(Pinta.DIAMANTE, Valor.DIEZ),
        new Carta(Pinta.DIAMANTE, Valor.JOTA),
        new Carta(Pinta.DIAMANTE, Valor.QUINA),
        new Carta(Pinta.DIAMANTE, Valor.KAISER)
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