"use client";

import { io } from "socket.io-client";

export const socket = io('ws://192.168.246.83:4567');