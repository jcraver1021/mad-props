import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Planchette, { PlanchetteStyle } from "./Planchette";

export type OuijaBoardProps = {
  message: string;
  isAnimating: boolean;
  onAnimationComplete: () => void;
  onCharacterVisit?: (char: string) => void;
  planchetteStyle?: PlanchetteStyle;
};

const BOARD_LAYOUT = {
  topArc: "ABCDEFGHIJKLM".split(""),
  bottomArc: "NOPQRSTUVWXYZ".split(""),
  numbers: "1234567890".split(""),
};

const VALID_CHARACTERS = new Set([..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "]);

export default function OuijaBoard({
  message,
  isAnimating,
  onAnimationComplete,
  onCharacterVisit,
  planchetteStyle = "wooden",
}: OuijaBoardProps) {
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [planchettePosition, setPlanchettePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isAnimating || !message) {
      setCurrentCharIndex(-1);
      return;
    }

    const firstChar = message[0].toUpperCase();
    if (VALID_CHARACTERS.has(firstChar)) {
      const firstPosition = getCharacterPosition(firstChar);
      if (firstPosition) {
        setPlanchettePosition(firstPosition);
      }
      if (onCharacterVisit) {
        setTimeout(() => {
          onCharacterVisit(firstChar);
        }, 500);
      }
    }
    setCurrentCharIndex(0);

    let charIndex = 1;
    const interval = setInterval(() => {
      if (charIndex < message.length) {
        const char = message[charIndex].toUpperCase();
        if (VALID_CHARACTERS.has(char)) {
          const position = getCharacterPosition(char);
          if (position) {
            setPlanchettePosition(position);
          }
          if (onCharacterVisit) {
            setTimeout(() => {
              onCharacterVisit(char);
            }, 500);
          }
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
  }, [message, isAnimating, onAnimationComplete, onCharacterVisit]);

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
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#1a0f08",
        cursor: "default",
        userSelect: "none",
        fontFamily: "'Cinzel Decorative', 'Georgia', serif",
        textShadow: "1px 1px 2px rgba(139, 69, 19, 0.3)",
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
        background:
          "linear-gradient(135deg, #d4a574 0%, #c89f6f 50%, #b8935f 100%)",
        borderRadius: "50px",
        border: "8px solid #4a2818",
        p: 4,
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.3)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          bottom: 16,
          border: "3px double #2c1810",
          borderRadius: "40px",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 30,
          left: 50,
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "'Cinzel Decorative', 'Georgia', serif",
          color: "#1a0f08",
          textShadow: "1px 1px 2px rgba(139, 69, 19, 0.3)",
        }}
        id="char-YES"
      >
        YES
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 30,
          right: 50,
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "'Cinzel Decorative', 'Georgia', serif",
          color: "#1a0f08",
          textShadow: "1px 1px 2px rgba(139, 69, 19, 0.3)",
        }}
        id="char-NO"
      >
        NO
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 90,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
          width: "75%",
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
          top: 170,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 3,
          width: "75%",
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
          top: 250,
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
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "1.8rem",
          fontWeight: "bold",
          fontFamily: "'Cinzel Decorative', 'Georgia', serif",
          color: "#1a0f08",
          textShadow: "1px 1px 2px rgba(139, 69, 19, 0.3)",
          letterSpacing: "0.2em",
        }}
        id="char-GOODBYE"
      >
        GOODBYE
      </Box>

      {isAnimating ? (
        <Planchette
          x={planchettePosition.x}
          y={planchettePosition.y}
          style={planchetteStyle}
        />
      ) : (
        <Planchette x={850} y={300} style={planchetteStyle} />
      )}
    </Box>
  );
}
