import { Box, Container, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import OuijaBoard from "../components/OuijaBoard/OuijaBoard";

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
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
          Ouija Board
        </Typography>

        <Box sx={{ mb: 4, width: "100%", maxWidth: 500 }}>
          <TextField
            fullWidth
            label="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isAnimating}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleAnimate}
            disabled={isAnimating || !message.trim()}
          >
            {isAnimating ? "Animating..." : "Animate Message"}
          </Button>
        </Box>

        <OuijaBoard
          message={animatingMessage}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
        />
      </Box>
    </Container>
  );
}

export default Ouija;
