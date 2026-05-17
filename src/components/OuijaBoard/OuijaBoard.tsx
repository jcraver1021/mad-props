import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Planchette from "./Planchette";

export type OuijaBoardProps = {
  message: string;
  isAnimating: boolean;
  onAnimationComplete: () => void;
};

const BOARD_LAYOUT = {
  topArc: "ABCDEFGHIJKLM".split(""),
  bottomArc: "NOPQRSTUVWXYZ".split(""),
  numbers: "1234567890".split(""),
};

export default function OuijaBoard({
  message,
  isAnimating,
  onAnimationComplete,
}: OuijaBoardProps) {
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [planchettePosition, setPlanchettePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAnimating || !message) {
      setCurrentCharIndex(-1);
      return;
    }

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < message.length) {
        const char = message[charIndex].toUpperCase();
        const position = getCharacterPosition(char);
        if (position) {
          setPlanchettePosition(position);
        }
        setCurrentCharIndex(charIndex);
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onAnimationComplete();
          setCurrentCharIndex(-1);
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [message, isAnimating, onAnimationComplete]);

  const getCharacterPosition = (
    char: string,
  ): { x: number; y: number } | null => {
    const element = document.getElementById(`char-${char}`);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    const boardRect = document
      .getElementById("ouija-board")
      ?.getBoundingClientRect();
    if (!boardRect) return null;

    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2,
    };
  };

  const renderCharacter = (char: string, key: string) => (
    <Box
      key={key}
      id={`char-${char}`}
      sx={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "text.primary",
        cursor: "default",
        userSelect: "none",
      }}
    >
      {char}
    </Box>
  );

  return (
    <Box
      id="ouija-board"
      sx={{
        position: "relative",
        width: 800,
        height: 600,
        background: "rgba(30, 41, 59, 0.8)",
        borderRadius: 4,
        border: "2px solid",
        borderColor: "primary.main",
        p: 4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
          width: "90%",
          justifyContent: "space-around",
        }}
      >
        {BOARD_LAYOUT.topArc.map((char, i) =>
          renderCharacter(char, `top-${i}`),
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
          width: "90%",
          justifyContent: "space-around",
        }}
      >
        {BOARD_LAYOUT.bottomArc.map((char, i) =>
          renderCharacter(char, `bottom-${i}`),
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 200,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {BOARD_LAYOUT.numbers.map((char, i) =>
          renderCharacter(char, `num-${i}`),
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 80,
          left: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
        id="char-YES"
      >
        YES
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 80,
          right: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
        id="char-NO"
      >
        NO
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
        id="char-GOODBYE"
      >
        GOODBYE
      </Box>

      {isAnimating && (
        <Planchette x={planchettePosition.x} y={planchettePosition.y} />
      )}
    </Box>
  );
}
