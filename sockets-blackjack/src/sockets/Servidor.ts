import {Server} from "socket.io";
import {Juego} from "@/models/game/Juego";

const io = new Server (4567, {})
const game = new Juego()
const sockets = [];
let socketActual = 0;

io.on ("connection", (socket) => {
    console.log('SE HA CONECTADO ALGUIEN');
    sockets.push(socket.id);

    //emite a todos los socket el estado del juego
    socket.broadcast.emit(JSON.stringify(game.obtenerEstadoJuego()));

    if (game.jugadores.indexOf(game.jugadorActivo) == socketActual) {
        io.to(sockets[game.jugadores.indexOf(game.jugadorActivo)]).emit("turno","Tu turno");
    }

    socket.on ("pedir", () => {
        if (game.jugadores.indexOf(game.jugadorActivo) != socketActual) {
            socket.emit("error","no es tu turno");
            return;
        }

        if (game.checkearPuntaje()) {
            //si tiene puntaje para jugar pide carta
            game.entregarCarta();
            game.avanzarTurno();
            if (game.calcularPuntaje(game.jugadores[socketActual]) > 21){
                io.to(sockets[socketActual].emit("Perdiste :<("))
            }
        }
        else {
            io.to(sockets[socketActual].emit("Perdiste :<("))
        }

        if (game.turno >= game.jugadores.length) {
            game.terminarRonda();
            //notificar a los que ganaron
            socketActual = 0;
        }
        else {
            socketActual = socketActual+1 % sockets.length;
        }
    });


});


io.of("jugador_actual", (socket) => {
    console.log(`Jugador actual: ${game.jugadorActivo}`)
})