"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { EstadoJuego } from "@/models/game/Juego";
import { Jugador } from "@/models/game/Jugador";
import { io, Socket } from "socket.io-client";
import DisplayCard, { CardSuite } from "@/models/cards/Carta";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ICard {
  card: DisplayCard;
  height: number;
}

const Card: React.FC<ICard> = ({ card, height = 100 }) => {
  const width = (5 * height) / 7;
  if (card.valorNombre == "1") card.pinta = CardSuite.PICA;
  const cardSrc = `/${card.valorNombre}${card.pinta}.svg`;

  return (
    <div
      style={{
        height: height,
        minWidth: width,
        maxHeight: "100%",
        maxWidth: (height * 5) / 7,
      }}
      className="animate-slide-in-top hover:animate-slide-out-top"
    >
      <Image
        src={cardSrc}
        alt="1"
        height={height}
        width={width}
        layout="intrinsic"
        objectFit="scale-down"
      ></Image>
    </div>
  );
};

function Dealer(gamestate: IEstadoJuego) {
  return (
    <>
      <div className="bg-green-900 h-auto p-2 flex flex-row justify-center items-center">
        <div className="flex h-auto max-w-full gap-4 overflow-hidden">
          {gamestate.estadoJuego.manoGrupier?.map((carta, i) => (
            <Card
              key={i}
              card={new DisplayCard(carta.pinta, carta.valorNombre)}
              height={200}
            />
          ))}
        </div>
      </div>
      <div className="bg-black h-fit flex justify-center p-2">
        <p className="text-white">
          Puntaje del croupier:{" "}
          {!gamestate.estadoJuego.puntajeGrupier
            ? 0
            : gamestate.estadoJuego.puntajeGrupier}
        </p>
      </div>
    </>
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
  gamestate: EstadoJuego;
}

const CardHolder: React.FC<IJugador> = ({ jugador, gamestate }) => {
  return (
    <div className="flex flex-col justify-center  text-center">
      <div
        className={`first-letter:border-x-[5px] border-b-[5px] border-dashed border-white h-[250px] aspect-[6/7]`}
      >
        <div className="relative">
          {jugador.mano.map((carta, i) => (
            <div key={i} className="absolute" style={{ left: i * 30 }}>
              <Card
                card={new DisplayCard(carta.pinta, carta.valorNombre)}
                height={200}
              />
            </div>
          ))}
        </div>
      </div>
      <p
        style={{
          backgroundColor:
            gamestate.nombreJugadorActivo == jugador.nombre
              ? "orange"
              : "green",
        }}
        className={`p-2 font-black mt-1 border-2 ${
          gamestate.nombreJugadorActivo == jugador.nombre
            ? "bg-orange-500 border-white"
            : "bg-green-200"
        } `}
      >
        Jugador {jugador.nombre}
      </p>
      <p style={{ color: "white" }}>Puntaje {jugador.puntaje}</p>
    </div>
  );
};

interface IEstadoJuego {
  estadoJuego: EstadoJuego;
}

function Players(gamestate: IEstadoJuego) {
  return (
    <div className="flex flex-row flex-grow justify-center items-end h-full w-full gap-14 py-10 min-h-[20vh]">
      {gamestate?.estadoJuego.jugadores?.map((jugador: Jugador, i) => (
        <CardHolder
          key={i}
          jugador={jugador}
          gamestate={gamestate.estadoJuego}
        />
      ))}
    </div>
  );
}

interface IPlayButtons {
  socket: Socket;
  gameState: EstadoJuego;
  isConfirmed;
  setIsConfirmed;
}

const PlayButtons: React.FC<IPlayButtons> = ({
  socket,
  gameState,
  isConfirmed,
  setIsConfirmed,
}) => {
  const [continua, setContinua] = useState(false);
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
    setContinua(true);
    console.log(socket.id);
    socket.emit("confirmar");
    setIsConfirmed(true);
  }

  return (
    <div className="flex flex-row justify-center items-end w-full gap-14 p-5 text-lg">
      {isConfirmed ? (
        <>
          <button
            className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
            onClick={bajarse}
          >
            Bajarse
          </button>

          <button
            className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
            onClick={pedir}
          >
            Pedir Carta
          </button>
        </>
      ) : (
        <button
          className="bg-white border-2 flex-1 border-black py-3 rounded-xl"
          onClick={confirmar}
        >
          {continua ? "Reiniciar" : "Confirmar"}
        </button>
      )}
    </div>
  );
};

function Connect({ socket, setSocket, serverIp, setServerIp }) {
  function tryConnect() {
    if (socket.connected) {
      console.log("already connected");
      return;
    }
    if (!serverIp) setServerIp("ws://localhost:4567");
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
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    socket.on("gamestate", (data: EstadoJuego) => {
      setGameState(data);
      if (data.nombreJugadorActivo == socket.id) {
        const notifyTurn = () => {
          toast("Es tu turno", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: "yellow", color: "black" },
            theme: "colored",
          });
        };
        notifyTurn();
      }
    });

    socket.on("finronda", (data: EstadoJuego) => {
      setGameState(data);
      setIsConfirmed(false);
      checkearGanadores(data);
    });

    function checkearGanadores(data: EstadoJuego) {
      if (
        data.jugadoresGanadores?.find((jugador) => {
          return jugador.nombre == socket.id;
        })
      ) {
        const notifySucces = () => {
          toast("Eres el ganador!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: "#4fbf26", color: "white" },
            theme: "colored",
          });
        };
        notifySucces();
      } else {
        const perdiste = () => {
          toast("Perdiste", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { backgroundColor: "red", color: "white" },
            theme: "colored",
          });
        };
        perdiste();
      }
    }
  }, [socket]);

  return (
    <main className="bg-black h-screen w-screen p-5 flex flex-col">
      <Board>
        <h1
          className="flex justify-center"
          style={{
            fontFamily: "Comic Neue",
            fontWeight: 700,
            color: "white",
            fontSize: 60,
          }}
        >
          🤠 💸♠️BLACKJACK♠️💸 🤠
        </h1>
        <ToastContainer />
        <Dealer estadoJuego={gameState} />

        {!socket.connected && (
          <Connect
            socket={socket}
            setSocket={setSocket}
            serverIp={serverIp}
            setServerIp={setServerIp}
          ></Connect>
        )}
        <Players estadoJuego={gameState}></Players>
        <PlayButtons
          socket={socket}
          gameState={gameState}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
        ></PlayButtons>
      </Board>
    </main>
  );
}
