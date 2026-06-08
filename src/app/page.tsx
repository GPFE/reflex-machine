"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { assign, createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useHotkeys } from "react-hotkeys-hook"
import { useEffect, useState } from "react";


type ReflexMachineContext = {
  score: number;
}

type ReflexMachineEvents = {
  type: "TOUCH" | "WRONG"
}

const reflexMachine = createMachine({
  types: {} as {
    context: ReflexMachineContext,
    events: ReflexMachineEvents
  },
  id: "flexMachine",
  context: { score: 0 },
  on: {
    TOUCH: {
      actions: assign({ score: ({ context }) => context.score + 1 })
    },
    WRONG: {
      actions: assign({ score: ({ context }) => context.score - 3 })
    }
  },
})

export default function Home() {
  const [state, send] = useMachine(reflexMachine)

  const [randomKey, setRandomKey] = useState("space")

  const getRandomKey = () => {
    const keys = ['space', 'a', 'b', 'c', 'd']
    setRandomKey(keys[Math.floor(Math.random() * keys.length)])
  }

  useEffect(() => {
    getRandomKey()
  }, [])

  useHotkeys(randomKey, () => {
    send({type: "TOUCH"})
    getRandomKey()
  }, { preventDefault: true })



  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Reflex Machine</h1>
        <p>Score: {state.context.score}</p>
        <p>Press {randomKey.toString().toUpperCase()} to start</p>
      </main>
    </div>
  );
}
