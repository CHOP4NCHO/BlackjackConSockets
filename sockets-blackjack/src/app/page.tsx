"use client";

import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { EstadoJuego } from "@/models/game/Juego";
import { Jugador } from "@/models/game/Jugador";
import { io, Socket } from "socket.io-client";
import DisplayCard, { CardSuite, CardValue } from "@/models/cards/Carta";

interface ICard {
  card: DisplayCard;
  height: number;
}

const Card: React.FC<ICard> = ({ card, height = 100 }) => {
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

function Dealer(gamestate: IEstadoJuego) {
  return (
    <div>
      <div className="bg-green-900 h-[30vh] p-2 flex flex-row justify-center  items-center">
        {gamestate.estadoJuego.manoGrupier?.map((carta) => (
          <Card card={new DisplayCard(carta.pinta, carta.valor)} height={200} />
        ))}
        <div>
          {gamestate.estadoJuego.manoGrupier?.map((carta) => (
            <p style={{ color: "white" }}>
              {carta.pinta} {carta.valor}
            </p>
          ))}
          <p style={{ color: "white" }}>
            Puntaje: {gamestate.estadoJuego.puntajeGrupier}
          </p>
        </div>
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
            <Card
              card={new DisplayCard(carta.pinta, carta.valor)}
              height={200}
            />
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
    <div className="flex flex-row justify-center items-end h-full w-full gap-14 py-10 min-h-[30vh]">
      {gamestate?.estadoJuego.jugadores?.map((jugador: Jugador) => (
        <CardHolder jugador={jugador} />
      ))}
    </div>
  );
}

export default function Game() {
  const [gameState, setGameState] = useState({} as EstadoJuego);
  const [serverIp, setServerIp] = useState("");
  const [askTurn, setAskTurn] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>(io({ reconnection: false }));

  //const socket: MutableRefObject<Socket> = useRef(io({ reconnection: false }));

  function tryConnect() {
    if (socket.connected) {
      console.log("already connected");
      return;
    }
    setSocket(io("ws://localhost:4567", { reconnection: false }));
    console.log(socket.id);
  }

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

  useEffect(() => {
    socket.on("turno", () => {
      setAskTurn(true);
    });

    socket.on("gamestate", (data: EstadoJuego) => {
      setGameState(data);
    });

    socket.on("finronda", (data: EstadoJuego) => {
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
    });
  }, [socket]);

  function confirmar() {
    console.log(socket.id);
    socket.emit("confirmar");
  }

  let players = [1];

  return (
    <main className="bg-black h-screen w-screen p-5 flex flex-col">
      <Board>
        <Dealer estadoJuego={gameState} />
        <div>
          <button
            style={{
              backgroundColor: "white",
              padding: 12,
              margin: 10,
              borderRadius: 10,
            }}
            onClick={tryConnect}
          >
            Conectarse
          </button>
        </div>
        <Players estadoJuego={gameState}></Players>

        <div className="flex flex-row justify-center items-end  w-full gap-14 py-10">
          <button
            style={{
              backgroundColor: "white",
              padding: 12,
              margin: 10,
              borderRadius: 10,
            }}
            onClick={confirmar}
          >
            Confirmar
          </button>
          <button
            style={{
              backgroundColor: "white",
              padding: 12,
              margin: 10,
              borderRadius: 10,
            }}
            onClick={pedir}
          >
            Pedir Carta
          </button>
          <button
            style={{
              backgroundColor: "white",
              padding: 12,
              margin: 10,
              borderRadius: 10,
            }}
            onClick={bajarse}
          >
            Bajarse
          </button>
        </div>
      </Board>
    </main>
  );
}
