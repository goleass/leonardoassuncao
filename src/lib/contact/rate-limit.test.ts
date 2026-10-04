import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

const HOUR = 60 * 60 * 1000;

function setup() {
  let clock = 0;
  const limiter = createRateLimiter({ limit: 5, windowMs: HOUR, now: () => clock });
  return {
    limiter,
    at(ms: number) {
      clock = ms;
    },
  };
}

describe("createRateLimiter (5 envios por IP em 60 min)", () => {
  it("permite 5 chamadas e bloqueia a 6ª dentro da janela", () => {
    const { limiter, at } = setup();
    const results = [0, 1, 2, 3, 4, 5].map((i) => {
      at(i * 60_000);
      return limiter.hit("1.1.1.1");
    });
    expect(results).toEqual([true, true, true, true, true, false]);
  });

  it("continua bloqueado até 1 ms antes de a janela expirar", () => {
    const { limiter, at } = setup();
    for (let i = 0; i < 5; i++) limiter.hit("1.1.1.1");
    at(HOUR - 1);
    expect(limiter.hit("1.1.1.1")).toBe(false);
  });

  it("permite de novo depois que a janela expira", () => {
    const { limiter, at } = setup();
    for (let i = 0; i < 5; i++) limiter.hit("1.1.1.1");
    expect(limiter.hit("1.1.1.1")).toBe(false);
    at(HOUR);
    expect(limiter.hit("1.1.1.1")).toBe(true);
  });

  it("janela deslizante: só o envio mais antigo que expirou libera vaga", () => {
    const { limiter, at } = setup();
    for (let i = 0; i < 5; i++) {
      at(i * 10 * 60_000); // 0, 10, 20, 30, 40 min
      limiter.hit("1.1.1.1");
    }
    at(HOUR); // o envio de 0 min expira; os de 10–40 min continuam valendo
    expect(limiter.hit("1.1.1.1")).toBe(true);
    expect(limiter.hit("1.1.1.1")).toBe(false);
  });

  it("IPs diferentes contam separadamente", () => {
    const { limiter } = setup();
    for (let i = 0; i < 5; i++) limiter.hit("1.1.1.1");
    expect(limiter.hit("1.1.1.1")).toBe(false);
    expect(limiter.hit("2.2.2.2")).toBe(true);
  });

  it("tentativas bloqueadas não estendem o bloqueio", () => {
    const { limiter, at } = setup();
    for (let i = 0; i < 5; i++) limiter.hit("1.1.1.1");
    at(30 * 60_000);
    expect(limiter.hit("1.1.1.1")).toBe(false);
    at(HOUR);
    expect(limiter.hit("1.1.1.1")).toBe(true);
  });
});
