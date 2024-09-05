import { Server, Socket } from "socket.io";
import { Juego } from "../models/game/Juego";
import { Jugador } from "../models/game/Jugador";
import { SocketId } from "socket.io-adapter";
import { inspect } from "util";
import { createServer } from "node:http";

const http = createServer();
const io = new Server(http, { cors: { origin: "*" } });

const juego = new Juego(); // Objeto gestor del juego
let sockets = []; // id de conexiones
let confirmados = []; // jugadores confirmados
const mapSocketJugadores = new Map<SocketId, string>();

const port = 4567;
const ip = "10.144.102.164";

http.listen(port, ip, () => {
  console.log(`Escuchando en http://${ip}:${port}`);
});

io.on("connection", (socket) => {
  onConnect();

  function isMyTurn() {
    if (socket.id != juego.getJugadorActivo().nombre) {
      console.error("error: solicitud fuera de turno");
      socket.emit("error", "no es tu turno");
      return false;
    }
    return true;
  }

  function hanConfirmadoTodos(): boolean {
    for (const conf of confirmados) {
      if (!conf) {
        console.warn(
          `Faltan jugadores por confirmar 
          Jugadores confirmados ${confirmados}`
        );
        return false;
      }
    }
    return true;
  }

  function resetearConfirmados() {
    for (let i = 0; i < confirmados.length; i++) {
      confirmados[i] = false;
    }
  }

  socket.on("confirmar", () => {
    console.info(`${socket.id} confirmó la ronda`);
    confirmados[sockets.indexOf(socket.id)] = true;

    if (!hanConfirmadoTodos()) return;

    juego.avanzarRonda();
    console.info(`Se entregó la mano inicial`);

    resetearConfirmados();

    io.emit("gamestate", juego.obtenerEstadoJuego());
  });

  socket.on("pedir", () => {
    if (!isMyTurn()) return;

    //si tiene puntaje para jugar pide carta
    if (juego.puedeSeguirPidiendoJA()) {
      console.info(
        `${socket.id} pidió en la ronda ${juego.ronda} 
        Puntaje antes de pedir: ${juego.getPuntajeJA()}`
      );

      juego.entregarCartaJugadorActual();
      juego.getJugadorActivo().puntaje = juego.calcularPuntaje(
        juego.getJugadorActivo().mano
      );

      console.info(`Puntaje después de pedir: ${juego.getPuntajeJA()}`);

      const seAcaboLaRonda = juego.turno + 1 == juego.jugadores.length;

      io.emit("gamestate", juego.obtenerEstadoJuego());

      if (seAcaboLaRonda && !juego.puedeSeguirPidiendoJA()) {
        juego.terminarRonda();
        io.emit("finronda", juego.obtenerEstadoJuego());
      } else if (!juego.puedeSeguirPidiendoJA()) {
        juego.avanzarTurno();
        io.emit("gamestate", juego.obtenerEstadoJuego());
      }
    }
    console.log(inspect(juego.obtenerEstadoJuego(), false, null, true));
  });

  socket.on("bajarse", () => {
    if (!isMyTurn()) return;

    console.info(
      `${socket.id} se bajó de la ronda ${juego.ronda}
      Puntaje al bajarse: ${juego.getPuntajeJA()}`
    );

    const seAcaboLaRonda = juego.turno + 1 == juego.jugadores.length;
    //io.emit("gamestate", juego.obtenerEstadoJuego());

    if (seAcaboLaRonda) {
      juego.terminarRonda();
      io.emit("finronda", juego.obtenerEstadoJuego());
      console.log(inspect(juego.obtenerEstadoJuego(), false, null, true));
    } else {
      juego.avanzarTurno();
      io.emit("gamestate", juego.obtenerEstadoJuego());
      console.log(inspect(juego.obtenerEstadoJuego(), false, null, true));
    }
  });

  socket.on("disconnect", () => {
    juego.jugadores = juego.jugadores.filter((j: Jugador) => {
      return j.nombre != mapSocketJugadores.get(socket.id);
    });
    sockets = sockets.filter((s) => {
      return s != socket.id;
    });
  });

  function onConnect() {
    console.warn(`Se ha conectado ${socket.id}`);
    sockets.push(socket.id);
    juego.jugadores.push({ nombre: socket.id, mano: [] } as Jugador);
    confirmados.push(false);
    mapSocketJugadores.set(socket.id, socket.id);
  }
});
