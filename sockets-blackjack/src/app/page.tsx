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

function Dealer() {
  return (
    <div className="bg-green-900 h-[30vh] p-2 flex flex-row justify-center  items-center">
      <Card height={200}></Card>
      <Card height={200}></Card>
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

function CardHolder({ player }) {
  return (
    <div className="flex flex-col justify-center items-stretch text-center">
      <div className="border-x-[5px] border-b-[5px] border-dashed border-white h-[250px] aspect-[6/7]"></div>
      <p className="py-2 font-black bg-green-100 mt-1">Jugador {player}</p>
    </div>
  );
}

function Players({ players }) {
  return (
    <div className="flex flex-row justify-center items-end h-full w-full gap-14 py-10 min-h-[30vh] ">
      {players.map((player) => (
        <CardHolder key={player} player={player}></CardHolder>
      ))}
    </div>
  );
}

export default function Game() {
  const [gameState, setGameState] = useState({} as EstadoJuego);
  const [jugador, setJugador] = useState({ nombre: "", mano: [] } as Jugador);
  const [serverIp, setServerIp] = useState("");
  const [askTurn, setAskTurn] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>(io());

  //const socket: MutableRefObject<Socket> = useRef(io({ reconnection: false }));

  function tryConnect() {
    setSocket(io("ws://localhost:4567"));
    if (socket.connected) {
      console.log("already connected");
      return;
    }
  }

  function pedir() {
    socket.emit("pedir");
  }

  useEffect(() => {
    socket.on("turno", () => {
      setAskTurn(true);
    });
  }, []);

  let players = [1, 2, 3];

  return (
    <main className="bg-black h-screen w-screen p-5 flex flex-col">
      <Board>
        <Dealer></Dealer>
        <div>
          <input type="text" onChange={(e) => setServerIp(e.target.value)} />
          <button onClick={tryConnect}>caca</button>
          {socket.connected ? <p>Verdadero</p> : <p>Falso</p>}
        </div>

        <div>
          <button onClick={pedir}>Pedir</button>
        </div>
        <Players players={players}></Players>
      </Board>
    </main>
  );
}
