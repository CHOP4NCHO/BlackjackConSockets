"use client";

import Image from "next/image";
import Carta, { REVERSO_ROJO } from "@/models/cards/Carta";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { EstadoJuego } from "@/models/game/Juego";
import { Jugador } from "@/models/game/Jugador";
import { io, Socket } from "socket.io-client";
//import { socket } from "@/socket";

// <Card number=CardNumbers.ACE suite=CardSuite.SPADES heigt="200"></Card>
interface ICard {
  card: Carta;
  height: number;
}

const Card: React.FC<ICard> = ({ card = REVERSO_ROJO, height = 100 }) => {
  const width = (5 * height) / 7;
  const cardSrc = `/${card.valor}${card.pinta}.svg`;

  return (
    <div
      style={{
        height: height,
        minWidth: width,
        maxHeight: "100%",
        maxWidth: (height * 5) / 7,
      }}
      className={`relative overflow-hidden`}
    >
      <Image src={cardSrc} alt="1" layout="fill" objectFit="scale-down"></Image>
    </div>
  );
};

interface IDealer {
  manoCroupier: Carta[];
  puntajeCroupier: number;
}

function Dealer(dealer: IDealer) {
  return (
    <div>
      <div className="bg-green-900 h-[30vh] p-2 flex flex-row justify-center  items-center">
        <Card height={200}></Card>
        <Card height={200}></Card>
      </div>
      <div className="bg-black h-fit flex justify p-2">
        {dealer.manoCroupier?.map((carta) => (
          <p style={{ color: "white" }}>
            {carta.pinta} {carta.valor}
          </p>
        ))}
        <p style={{ color: "white" }}>Puntaje: {dealer.puntajeCroupier}</p>
      </div>
    </div>
  );
}

function Board({ children }) {
  return (
    <div className="flex flex-col border-2 border-white bg-green-950 h-full overflow-hidden">
      {children}
    </div>
  );
}

interface IJugador {
  jugador: Jugador;
}

function CardHolder(player: IJugador) {
  return (
    <div className="flex flex-col justify-center  text-center">
      <div className="border-x-[5px] border-b-[5px] border-dashed border-white h-[250px] aspect-[6/7]">
        <div>
          <p style={{ color: "white" }}>Cartas</p>
          {player.jugador.mano.map((carta) => (
            <p style={{ color: "white" }}>
              {carta.pinta} {carta.valor}
            </p>
          ))}
        </div>
      </div>
      <p className="py-2 font-black bg-green-100 mt-1">
        Jugador {player.jugador.nombre}
      </p>
      <p style={{ color: "white" }}>Puntaje {player.jugador.puntaje}</p>
    </div>
  );
}

interface IEstadoJuego {
  estadoJuego: EstadoJuego;
}
function Players(gamestate: IEstadoJuego) {
  return (
    <div className="flex flex-row flex-grow justify-center items-end h-full w-full gap-14 py-10 min-h-[20vh] ">
      {gamestate?.estadoJuego.jugadores?.map((jugador: Jugador) => (
        <CardHolder jugador={jugador} />
      ))}
    </div>
  );
}

interface IPlayButtons {
  socket: Socket;
  gameState: EstadoJuego;
}

const PlayButtons: React.FC<IPlayButtons> = ({ socket, gameState }) => {
  function pedir() {
    if (gameState.nombreJugadorActivo == socket.id) {
      console.log("Tuturno");
      socket.emit("pedir");
      return;
    }
    console.log("no le toca");
  }
  function bajarse() {
    socket.emit("bajarse");
    console.log("Me baje ", socket.id);
  }
  function confirmar() {
    console.log(socket.id);
    socket.emit("confirmar");
  }

  return (
    <div className="flex flex-row justify-center items-end w-full gap-14 p-5 text-lg">
      <button
        className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
        onClick={confirmar}
      >
        Confirmar
      </button>
      <button
        className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
        onClick={pedir}
      >
        Pedir Carta
      </button>
      <button
        className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
        onClick={bajarse}
      >
        Bajarse
      </button>
    </div>
  );
};

function Connect({ socket, setSocket, serverIp, setServerIp }) {
  function tryConnect() {
    if (socket.connected) {
      console.log("already connected");
      return;
    }
    setSocket(io(serverIp, { reconnection: false }));
    console.log(socket.id);
  }
  return (
    <div className="flex flex-col gap-2 justify-center align-middle items-center p-3">
      <div className="flex gap-2">
        <input
          type="text"
          className="rounded-lg border-2 border-black p-2"
          onChange={(e) => {
            setServerIp(e.target.value);
          }}
        />
        <button
          className="bg-white rounded-lg border-2 border-black p-2"
          onClick={tryConnect}
        >
          Conectarse
        </button>
      </div>
    </div>
  );
}

export default function Game() {
  const [gameState, setGameState] = useState({} as EstadoJuego);
  const [serverIp, setServerIp] = useState("");
  const [socket, setSocket] = useState<Socket>(io({ reconnection: false }));

  useEffect(() => {
    socket.on("gamestate", (data: EstadoJuego) => {
      setGameState(data);
    });

    socket.on("finronda", (data: EstadoJuego) => {
      setGameState(data);
      checkearGanadores(data);
    });

    function checkearGanadores(data: EstadoJuego) {
      if (
        data.jugadoresGanadores?.find((jugador) => {
          return jugador.nombre == socket.id;
        })
      ) {
        alert(
          `GANASTE PAPU, puntaje crupier: ${
            data?.puntajeGrupier
          } puntajes ${data?.jugadores.forEach((j) => {
            return j.puntaje;
          })}`
        );
      } else {
        alert(
          `PERDISTE CHAVO PIPIPIPI, puntaje crupier: ${data?.puntajeGrupier}`
        );
      }
    }
  }, [socket]);

  return (
    <main className="bg-black h-screen w-screen p-5 flex flex-col">
      <Board>
        <Dealer
          manoCroupier={gameState.manoGrupier}
          puntajeCroupier={gameState.puntajeGrupier}
        />
        <Connect
          socket={socket}
          setSocket={setSocket}
          serverIp={serverIp}
          setServerIp={setServerIp}
        ></Connect>
        <Players estadoJuego={gameState}></Players>
        <PlayButtons socket={socket} gameState={gameState}></PlayButtons>
      </Board>
    </main>
  );
}
