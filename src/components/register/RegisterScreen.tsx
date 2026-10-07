"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

const backgroundSrc = "/images/registration/registrationpageBG.webp";
const headingSrc = "/images/registration/Page%202%20_name-01.svg";
const readySrc = "/images/registration/Page%202%20_ready-01.svg";

const ink = "#4A0D10";
const orange = "#FF5900";
const maxLength = 24;

const letterRows = ["qwertyuiop".split(""), "asdfghjkl".split(""), "zxcvbnm".split("")];
const digitRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const symbolRow = ["-", "/", ":", ";", "(", ")", "₹", "&", "@", "\""];
const punctRow = [".", ",", "?", "!", "'"];
const moreRow = ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="];
const moreRowNext = ["_", "\\", "|", "~", "<", ">", "$", "€", "£", "•"];

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [shake, setShake] = useState(0);
  const [caps, setCaps] = useState(false);
  const [board, setBoard] = useState<"letters" | "numbers" | "symbols">("letters");
  const trimmed = name.trim();
  const upper = caps || name.length === 0 || name.endsWith(" ");

  function continueToGame() {
    if (!trimmed) {
      setInvalid(true);
      setShake((value) => value + 1);
      return;
    }
    sessionStorage.setItem("rider-name", trimmed);
    router.push("/instructions");
  }

  function typeChar(char: string) {
    setInvalid(false);
    setName((current) => (current.length >= maxLength ? current : current + char));
  }

  function typeSpace() {
    setInvalid(false);
    setName((current) => {
      if (!current || current.endsWith(" ") || current.length >= maxLength) return current;
      return `${current} `;
    });
  }

  function backspace() {
    setName((current) => current.slice(0, -1));
  }

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black">
      <section
        className="relative overflow-hidden"
        style={{
          containerType: "size",
          width: "min(100vw, calc(100dvh * 9 / 16))",
          height: "min(100dvh, calc(100vw * 16 / 9))",
        }}
      >
        <img src={backgroundSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />

        <form
          className="absolute inset-x-[8%] top-[6%] z-10 flex flex-col items-center"
          onSubmit={(event) => {
            event.preventDefault();
            continueToGame();
          }}
        >
          <img src={headingSrc} alt="What's your name?" className="w-[82%]" />

          <div
            key={shake}
            className={`mt-[3.2cqh] w-[86%] ${shake > 0 ? "animate-[register-shake_0.45s_ease]" : ""}`}
          >
            <input
              value={name}
              readOnly
              placeholder="Enter your name"
              aria-label="Your name"
              aria-invalid={invalid}
              inputMode="none"
              maxLength={maxLength}
              className={`${geist.className} h-[6.2cqh] w-full rounded-full bg-white px-[4cqw] text-center text-[2.3cqh] font-bold shadow-[0_8px_18px_rgba(40,10,8,0.18)] outline-none placeholder:font-semibold placeholder:text-[#4A0D10]/45`}
              style={{
                color: ink,
                border: invalid ? `0.35cqh solid ${orange}` : "0.35cqh solid transparent",
                boxShadow: invalid
                  ? "0 0 0 0.45cqh rgba(255,89,0,0.28), 0 8px 18px rgba(40,10,8,0.18)"
                  : undefined,
              }}
            />
          </div>

          <p className="mt-[1cqh] text-center text-[1.35cqh] font-semibold" style={{ color: ink }}>
            This name will be shown on the leaderboard.
          </p>

          <button type="submit" aria-label="Ready" className="mt-[1.8cqh] w-[58%]">
            <img src={readySrc} alt="Ready" className="w-full" />
          </button>
        </form>

        <div className={`${geist.className} absolute inset-x-[3.5%] bottom-[33cqh] z-20 rounded-[1.8cqh] bg-[#FFF8F3]/30 p-[0.9cqh] shadow-[0_12px_28px_rgba(74,13,16,0.18)]`}>
          <div className="flex flex-col gap-[0.5cqh]">
            {board === "letters" ? (
              letterRows.map((row, rowIndex) => (
                <div key={row.join("")} className="flex gap-[0.45cqw]">
                  {rowIndex === 1 ? <span className="min-w-0" style={{ flex: 0.5 }} /> : null}
                  {rowIndex === 2 ? (
                    <Key
                      label="caps"
                      grow={1.5}
                      pressed={caps}
                      tone={upper ? "orange" : "white"}
                      onClick={() => setCaps((on) => !on)}
                    />
                  ) : null}
                  {row.map((letter) => {
                    const shown = upper ? letter.toUpperCase() : letter;
                    return <Key key={letter} label={shown} onClick={() => typeChar(shown)} />;
                  })}
                  {rowIndex === 2 ? <Key label="delete" grow={1.5} tone="orange" onClick={backspace} /> : null}
                  {rowIndex === 1 ? <span className="min-w-0" style={{ flex: 0.5 }} /> : null}
                </div>
              ))
            ) : (
              <>
                <div className="flex gap-[0.45cqw]">
                  {(board === "numbers" ? digitRow : moreRow).map((symbol) => (
                    <Key key={symbol} label={symbol} onClick={() => typeChar(symbol)} />
                  ))}
                </div>
                <div className="flex gap-[0.45cqw]">
                  {(board === "numbers" ? symbolRow : moreRowNext).map((symbol) => (
                    <Key key={symbol} label={symbol} onClick={() => typeChar(symbol)} />
                  ))}
                </div>
                <div className="flex gap-[0.45cqw]">
                  <Key
                    label={board === "numbers" ? "#+=" : "123"}
                    grow={1.6}
                    onClick={() => setBoard(board === "numbers" ? "symbols" : "numbers")}
                  />
                  {punctRow.map((symbol) => (
                    <Key key={symbol} label={symbol} grow={1.36} onClick={() => typeChar(symbol)} />
                  ))}
                  <Key label="delete" grow={1.6} tone="orange" onClick={backspace} />
                </div>
              </>
            )}
            <div className="flex gap-[0.45cqw]">
              <Key
                label={board === "letters" ? "123" : "ABC"}
                grow={1.5}
                onClick={() => setBoard(board === "letters" ? "numbers" : "letters")}
              />
              <Key label="space" grow={7} onClick={typeSpace} />
              <Key label="return" grow={1.5} tone="orange" onClick={continueToGame} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Key({
  label,
  onClick,
  tone = "white",
  pressed = false,
  grow = 1,
}: {
  label: string;
  onClick: () => void;
  tone?: "white" | "orange";
  pressed?: boolean;
  grow?: number;
}) {
  const orangeKey = tone === "orange";
  const name =
    label === "delete"
      ? "Delete"
      : label === "caps"
        ? "Caps"
        : label === "123"
          ? "Numbers"
          : label === "ABC"
            ? "Letters"
            : label === "#+="
              ? "More symbols"
              : label === "return"
                ? "Return"
                : label;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      aria-pressed={label === "caps" || label === "123" || label === "ABC" ? pressed : undefined}
      className={`flex h-[4.55cqh] min-w-0 items-center justify-center rounded-[1.15cqh] font-black shadow-[0_0.28cqh_0_#E4CBBA] active:translate-y-[0.2cqh] active:shadow-none ${
        label === "123" || label === "ABC" || label === "#+=" ? "text-[1.35cqh]" : "text-[1.7cqh]"
      }`}
      style={{
        flex: grow,
        background: orangeKey ? orange : "#FFFFFF",
        color: orangeKey ? "#FFFFFF" : ink,
      }}
    >
      {label === "delete" ? <DeleteIcon /> : label === "caps" ? <CapsIcon /> : label === "return" ? <ReturnIcon /> : label}
    </button>
  );
}

function CapsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[2.1cqh] w-[2.1cqh]" fill="currentColor" aria-hidden="true">
      <path d="M12 4.2 4.2 12h4.1v6.2h7.4V12h4.1L12 4.2z" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[2.2cqh] w-[2.4cqh]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 7v5a2 2 0 0 1-2 2H6" />
      <path d="M9 10.5 5.5 14 9 17.5" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[2.2cqh] w-[2.6cqh]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 6.5h10a1.2 1.2 0 0 1 1.2 1.2v8.6a1.2 1.2 0 0 1-1.2 1.2h-10L3.2 12l5.3-5.5z" />
      <path d="M11 10l5 4.2M16 10l-5 4.2" />
    </svg>
  );
}
