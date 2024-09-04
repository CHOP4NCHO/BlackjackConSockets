import { Server } from "socket.io";
import { Juego } from "../models/game/Juego";
import { Jugador } from "../models/game/Jugador";
import { SocketId } from "socket.io-adapter";

const io = new Server({ cors: { origin: "*" } });
const game = new Juego();
let sockets = []; // id de conexiones
let confirmed = [];
let socketActual = 0; // turno de la conexion
const mapSocketJugadores = new Map<SocketId, string>();

io.on("connection", (socket) => {
  onConnect();

  function isMyTurn() {
    if (socket.id != game.getJugadorActivo().nombre) {
      console.error("error: solicitud fuera de turno");
      socket.emit("error", "no es tu turno");
      return false;
    }
    return true;
  }

  socket.on("confirmar", () => {
    console.log(socket.id);
    confirmed[sockets.indexOf(socket.id)] = true;

    for (const conf of confirmed) {
      if (!conf) {
        console.log("faltan jugadores por confirmar");
        return;
      }
    }

    console.log("se esta entregando la mano inicial...");
    game.entregarManoInicial();
    console.log("se entrego la mano inicial");
    console.log(game.obtenerEstadoJuego());

    io.emit("gamestate", game.obtenerEstadoJuego());
  });

  socket.on("pedir", () => {
    if (!isMyTurn()) return;

    if (game.puedeSeguirPidiendoJA()) {
      console.log(`${socket.id} pidio en la ronda ${game.ronda}`);

      //si tiene puntaje para jugar pide carta
      console.log(`puntaje actual de ${socket.id}: ${game.getPuntajeJA()}`);
      game.entregarCartaJugadorActual();
      game.getJugadorActivo().puntaje = game.calcularPuntaje(
        game.getJugadorActivo().mano
      );
      console.log(`puntaje despues de pedir: ${game.getPuntajeJA()}`);


      const seAcaboLaRonda = game.turno+1 == game.jugadores.length;

      if (seAcaboLaRonda && !game.puedeSeguirPidiendoJA()) {
        game.terminarRonda();

        io.emit("finronda", game.obtenerEstadoJuego());
        game.avanzarRonda();

        confirmed = []
      }
      else if ( !game.puedeSeguirPidiendoJA()) {
        io.emit("gamestate", game.obtenerEstadoJuego());console.log(game.obtenerEstadoJuego());
        game.avanzarTurno();
      }
    }
    io.emit("gamestate", game.obtenerEstadoJuego());console.log(game.obtenerEstadoJuego());


  });

  socket.on("bajarse", () => {
    if (!isMyTurn()) return;

    if (!game.puedeSeguirPidiendoJA()) {
      console.log("!!!NO PUEDES HACER ESO SEÑOR SOCKET,", socket.id);
      return;
    }
    console.log(`socket ${socket.id} se bajo de la ronda ${game.ronda}`);


    const seAcaboLaRonda = game.turno+1 == game.jugadores.length

    if (seAcaboLaRonda) {
      game.terminarRonda();
      io.emit("finronda", game.obtenerEstadoJuego());
      game.avanzarRonda();
      confirmed = []
      io.emit("gamestate", game.obtenerEstadoJuego());console.log(game.obtenerEstadoJuego());
    }
    else  {
      game.avanzarTurno();
      io.emit("gamestate", game.obtenerEstadoJuego());console.log(game.obtenerEstadoJuego());
    }
  });

  socket.on("disconnect", () => {
    game.jugadores = game.jugadores.filter((j: Jugador) => {
      return j.nombre != mapSocketJugadores.get(socket.id);
    });
    sockets = sockets.filter((s) => {
      return s != socket.id;
    });
  });

  function onConnect() {
    console.log("SE HA CONECTADO ALGUIEN");
    sockets.push(socket.id);
    game.jugadores.push({ nombre: socket.id, mano: [] } as Jugador);
    confirmed.push(false);
    mapSocketJugadores.set(socket.id, socket.id);
  }
});

const port = 4567;
console.log(`server listening on port ${port}`);
io.listen(port);
