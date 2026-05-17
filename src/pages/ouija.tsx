import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useCallback, useMemo } from "react";
import OuijaBoard from "../components/OuijaBoard/OuijaBoard";
import MessageScroll from "../components/OuijaBoard/MessageScroll";
import { ouijaTheme } from "../components/OuijaBoard/ouija-theme";
import { PlanchetteStyle } from "../components/OuijaBoard/Planchette";

const VALID_CHARACTERS = new Set([
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
  "YES",
  "NO",
  "GOODBYE",
]);

function Ouija() {
  const [message, setMessage] = useState("");
  const [animatingMessage, setAnimatingMessage] = useState("");
  const [transcribedMessage, setTranscribedMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [planchetteStyle, setPlanchetteStyle] =
    useState<PlanchetteStyle>("wooden");

  const handleAnimate = () => {
    if (message.trim()) {
      setAnimatingMessage(message);
      setTranscribedMessage("");
      setIsAnimating(true);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const handleCharacterVisit = useCallback((char: string) => {
    setTranscribedMessage((prev) => prev + char);
  }, []);

  const handleReset = () => {
    setMessage("");
    setAnimatingMessage("");
    setTranscribedMessage("");
    setIsAnimating(false);
  };

  const expectedScrollLength = useMemo(() => {
    if (!isAnimating && !transcribedMessage) return undefined;
    return animatingMessage
      .toUpperCase()
      .split("")
      .filter((char) => VALID_CHARACTERS.has(char)).length;
  }, [isAnimating, transcribedMessage, animatingMessage]);

  return (
    <ThemeProvider theme={ouijaTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            background: "linear-gradient(to bottom, #2a1810 0%, #1a0f08 100%)",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              color: "#d4a574",
              fontFamily: "'Cinzel Decorative', 'Georgia', serif",
              letterSpacing: "0.15em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Spirit Board
          </Typography>

          <Box sx={{ mb: 4, width: "100%", maxWidth: 500 }}>
            <TextField
              fullWidth
              label="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isAnimating}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(212, 165, 116, 0.1)",
                  "& fieldset": {
                    borderColor: "#8b6f47",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#d4a574",
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d4a574",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#d4a574",
                  "&.Mui-focused": {
                    color: "#d4a574",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#d4a574",
                  fontFamily: "'Cinzel', 'Georgia', serif",
                },
              }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#d4a574",
                  mb: 1,
                  fontFamily: "'Cinzel', 'Georgia', serif",
                  fontSize: "0.9rem",
                }}
              >
                Planchette Style
              </Typography>
              <ToggleButtonGroup
                value={planchetteStyle}
                exclusive
                onChange={(_, newStyle) => {
                  if (newStyle !== null) {
                    setPlanchetteStyle(newStyle);
                  }
                }}
                fullWidth
                disabled={isAnimating}
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "#d4a574",
                    borderColor: "#8b6f47",
                    fontFamily: "'Cinzel', 'Georgia', serif",
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #8b6f47 0%, #6b5435 100%)",
                      color: "#f5e6d3",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #9b7f57 0%, #7b6445 100%)",
                      },
                    },
                    "&:hover": {
                      background: "rgba(212, 165, 116, 0.1)",
                    },
                  },
                }}
              >
                <ToggleButton value="wooden">Wooden</ToggleButton>
                <ToggleButton value="spectral">Spectral</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAnimate}
                disabled={isAnimating || !message.trim()}
                sx={{
                  background:
                    "linear-gradient(135deg, #8b6f47 0%, #6b5435 100%)",
                  border: "2px solid #4a2818",
                  color: "#f5e6d3",
                  fontFamily: "'Cinzel', 'Georgia', serif",
                  letterSpacing: "0.1em",
                  py: 1.5,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #9b7f57 0%, #7b6445 100%)",
                  },
                  "&:disabled": {
                    background: "#4a3828",
                    color: "#8b7355",
                  },
                }}
              >
                {isAnimating ? "Channeling Spirits..." : "Summon the Spirits"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={!message && !transcribedMessage && !isAnimating}
                sx={{
                  borderColor: "#8b6f47",
                  borderWidth: "2px",
                  color: "#d4a574",
                  fontFamily: "'Cinzel', 'Georgia', serif",
                  letterSpacing: "0.1em",
                  py: 1.5,
                  px: 3,
                  "&:hover": {
                    borderColor: "#d4a574",
                    borderWidth: "2px",
                    background: "rgba(212, 165, 116, 0.1)",
                  },
                  "&:disabled": {
                    borderColor: "#4a3828",
                    color: "#8b7355",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <OuijaBoard
            message={animatingMessage}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
            onCharacterVisit={handleCharacterVisit}
            planchetteStyle={planchetteStyle}
          />

          <MessageScroll
            message={transcribedMessage}
            expectedLength={expectedScrollLength}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Ouija;
