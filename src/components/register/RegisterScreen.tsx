"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const backgroundSrc = "/images/registration/registrationpageBG.webp";
const headingSrc = "/images/registration/Page%202%20_name-01.svg";
const readySrc = "/images/registration/Page%202%20_ready-01.svg";

const ink = "#4A0D10";

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const trimmed = name.trim();

  function continueToGame() {
    if (!trimmed) return;
    sessionStorage.setItem("rider-name", trimmed);
    router.push("/instructions");
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
          className="absolute inset-x-[8%] top-[12%] z-10 flex flex-col items-center"
          onSubmit={(event) => {
            event.preventDefault();
            continueToGame();
          }}
        >
          <img src={headingSrc} alt="What's your name?" className="w-[86%]" />

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            aria-label="Your name"
            autoComplete="name"
            maxLength={24}
            className="mt-[8cqh] h-[6.2cqh] w-[78%] rounded-full bg-white px-[4cqw] text-center text-[2.3cqh] font-bold text-[#4A0D10] shadow-[0_8px_18px_rgba(40,10,8,0.18)] outline-none placeholder:font-semibold placeholder:text-[#4A0D10]/45"
          />

          <p className="mt-[1.2cqh] text-center text-[1.45cqh] font-semibold" style={{ color: ink }}>
            This name will be shown on the leaderboard.
          </p>

          <button
            type="submit"
            aria-label="Ready"
            disabled={!trimmed}
            className="mt-[3.4cqh] w-[58%]"
          >
            <img src={readySrc} alt="Ready" className="w-full" />
          </button>
        </form>
      </section>
    </main>
  );
}
