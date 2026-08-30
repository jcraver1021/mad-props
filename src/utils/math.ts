import type { GameSettings, Op, Problem } from "../components/MinuteMath/types";

/** Returns a random integer in the inclusive range [min, max]. */
export function rand(max: number, min = 1): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(settings: GameSettings): Problem {
  const { ops, maxOperand, allowNegative } = settings;
  const op = ops[Math.floor(Math.random() * ops.length)] as Op;

  if (op === "+") {
    const a = rand(maxOperand);
    const b = rand(maxOperand);
    return { a, b, op, answer: a + b };
  }

  if (op === "−") {
    const a = rand(maxOperand);
    if (allowNegative) {
      const b = rand(maxOperand);
      return { a, b, op, answer: a - b };
    }
    const b = rand(Math.min(a, maxOperand));
    return { a, b, op, answer: a - b };
  }

  if (op === "×") {
    const a = rand(maxOperand);
    const b = rand(maxOperand);
    return { a, b, op, answer: a * b };
  }

  // ÷: generate answer and divisor first so the quotient is always a whole number
  const answer = rand(maxOperand);
  const b = rand(maxOperand);
  return { a: b * answer, b, op: "÷", answer };
}

/**
 * Returns a rough grade-level label for the given settings.
 * When negative numbers are enabled the result is always "Grade 6+" since that
 * is when integers are formally introduced in most curricula.
 */
export function estimateGrade(
  ops: Op[],
  maxOperand: number,
  allowNegative = false,
): string {
  if (allowNegative) return "Grade 6+";

  const hasAdd = ops.includes("+");
  const hasSub = ops.includes("−");
  const hasMul = ops.includes("×");
  const hasDiv = ops.includes("÷");

  if (!hasMul && !hasDiv) {
    if (maxOperand <= 10) return "Grade 1";
    if (maxOperand <= 20) return "Grade 2";
    return "Grade 3";
  }

  if (!hasAdd && !hasSub) {
    if (hasMul && !hasDiv) {
      return maxOperand <= 10 ? "Grade 3" : "Grade 4";
    }
    return maxOperand <= 12 ? "Grade 4" : "Grade 5";
  }

  return maxOperand <= 12 ? "Grade 4–5" : "Grade 5+";
}
