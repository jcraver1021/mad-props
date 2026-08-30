import {
  Box,
  Button,
  Container,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import Propeller, {
  PropellerDirection,
} from "../components/Propeller/Propeller";

export default function PropellerPage() {
  const [rpm, setRpm] = useState(120);
  const [bladeCount, setBladeCount] = useState(3);
  const [direction, setDirection] = useState<PropellerDirection>("cw");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Button
        component={Link}
        to="/"
        variant="outlined"
        size="small"
        sx={{ position: "absolute", top: 16, left: 16 }}
      >
        ← Home
      </Button>

      <Container maxWidth="xs" sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Propeller
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Propeller rpm={rpm} bladeCount={bladeCount} direction={direction} />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Speed — {rpm} RPM
        </Typography>
        <Slider
          value={rpm}
          onChange={(_, v) => setRpm(v as number)}
          min={0}
          max={600}
          step={10}
          valueLabelDisplay="auto"
          aria-label="Propeller speed"
        />

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ mt: 3 }}
        >
          Blades — {bladeCount}
        </Typography>
        <Slider
          value={bladeCount}
          onChange={(_, v) => setBladeCount(v as number)}
          min={1}
          max={12}
          step={1}
          marks
          valueLabelDisplay="auto"
          aria-label="Blade count"
        />

        <Box sx={{ mt: 3 }}>
          <ToggleButtonGroup
            value={direction}
            exclusive
            onChange={(_, v) => {
              if (v !== null) setDirection(v);
            }}
          >
            <ToggleButton value="cw">Clockwise</ToggleButton>
            <ToggleButton value="ccw">Counterclockwise</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Container>
    </Box>
  );
}
