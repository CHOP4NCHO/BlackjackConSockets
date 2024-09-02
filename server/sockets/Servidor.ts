import {Server} from "socket.io";
import {Juego} from "sockets-blackjack/src/models/game/Juego";
import {Jugador} from "../src/models/game/Jugador";
import {SocketId} from "socket.io-adapter";
import {createServer} from "node:http";

const http = createServer();
const io =  new Server (http, { cors: { origin: '*' } });
const game = new Juego()
let sockets = [];
let socketActual = 0;
const hashTable = new Map<SocketId, string>()

io.on ("connection", (socket) => {

    console.log('SE HA CONECTADO ALGUIEN');
    sockets.push(socket.id);
    game.jugadores.push({ nombre: 'pepe', mano: []} as Jugador)
    hashTable.set(socket.id, socket.data.nombre)

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
        //emite a todos los socket el estado del juego
        socket.broadcast.emit(JSON.stringify(game.obtenerEstadoJuego()));

        if (game.jugadores.indexOf(game.jugadorActivo) == socketActual) {
            io.to(sockets[game.jugadores.indexOf(game.jugadorActivo)]).emit("turno","Tu turno");
        }
    });

    socket.on("disconnect", () => {
        game.jugadores = game.jugadores.filter(
            (j) => { return j.nombre != hashTable.get(socket.id)}
        )
        sockets = sockets.filter(
            (s) => { return s != socket.id }
        )
    })
});



http.listen(4567);