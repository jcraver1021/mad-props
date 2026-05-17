import { Box, Container, TextField, Button, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import OuijaBoard from "../components/OuijaBoard/OuijaBoard";
import { ouijaTheme } from "../components/OuijaBoard/ouija-theme";

function Ouija() {
  const [message, setMessage] = useState("");
  const [animatingMessage, setAnimatingMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimate = () => {
    if (message.trim()) {
      setAnimatingMessage(message);
      setIsAnimating(true);
    }
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

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
                  },
                  "&:hover fieldset": {
                    borderColor: "#d4a574",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#d4a574",
                },
                "& .MuiInputBase-input": {
                  color: "#d4a574",
                  fontFamily: "'Cinzel', 'Georgia', serif",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnimate}
              disabled={isAnimating || !message.trim()}
              sx={{
                background: "linear-gradient(135deg, #8b6f47 0%, #6b5435 100%)",
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
          </Box>

          <OuijaBoard
            message={animatingMessage}
            isAnimating={isAnimating}
            onAnimationComplete={handleAnimationComplete}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Ouija;
