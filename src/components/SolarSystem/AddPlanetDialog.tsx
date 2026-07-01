import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { PlanetConfig } from "../../common/physics/orbital";
import { PLANET_COLORS } from "./constants";

interface AddPlanetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (config: PlanetConfig) => void;
}

export function AddPlanetDialog({
  open,
  onClose,
  onAdd,
}: AddPlanetDialogProps) {
  const [name, setName] = useState("New Planet");
  const [color, setColor] = useState(PLANET_COLORS[1]);
  const [orbitalRadius, setOrbitalRadius] = useState(220);
  const [size, setSize] = useState(4);
  const [eccentricity, setEccentricity] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [hasRing, setHasRing] = useState(false);

  const previewRef = useRef<HTMLCanvasElement>(null);

  // Re-draw the orbit preview whenever any parameter changes
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Background
    ctx.fillStyle = "#050d1a";
    ctx.fillRect(0, 0, W, H);

    // Mini star
    const sg = ctx.createRadialGradient(cx, cy, 1, cx, cy, 10);
    sg.addColorStop(0, "#FFFDE7");
    sg.addColorStop(1, "#FF8F00");
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = sg;
    ctx.fill();

    // Orbit ellipse
    const e = eccentricity;
    const rp = orbitalRadius;
    const a = rp / (1 - e);
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e;
    const scale = (Math.min(W, H) * 0.42) / Math.max(a, 10);

    const ecx = cx - c * scale * Math.cos(startAngle);
    const ecy = cy - c * scale * Math.sin(startAngle);
    ctx.save();
    ctx.translate(ecx, ecy);
    ctx.rotate(startAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, a * scale, b * scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color + "90";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Planet dot
    const px = cx + rp * scale * Math.cos(startAngle);
    const py = cy + rp * scale * Math.sin(startAngle);
    const vr = Math.max(3, size * 1.2);

    if (hasRing) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.ellipse(0, 0, vr * 2.4, vr * 0.45, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(196,163,90,0.55)";
      ctx.lineWidth = vr * 0.6;
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(px, py, vr, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [orbitalRadius, eccentricity, size, color, startAngle, hasRing]);

  const eccentricityLabel =
    eccentricity === 0
      ? "circular"
      : eccentricity < 0.3
        ? "slightly elliptical"
        : eccentricity < 0.6
          ? "elliptical"
          : "highly elliptical";

  const handleAdd = () => {
    onAdd({
      name: name.trim() || "Planet",
      color,
      orbitalRadius,
      size,
      eccentricity,
      startAngle,
      hasRing,
    });
    onClose();
    // Reset to fresh defaults
    setName("New Planet");
    setColor(PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)]);
    setOrbitalRadius(200 + Math.floor(Math.random() * 100) - 50);
    setSize(4);
    setEccentricity(0);
    setStartAngle(Math.random() * Math.PI * 2);
    setHasRing(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Planet</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            fullWidth
          />

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Color
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {PLANET_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: c,
                    cursor: "pointer",
                    border:
                      color === c ? "3px solid #fff" : "3px solid transparent",
                    transition: "transform 0.12s",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Orbital radius — {orbitalRadius} px from star
            </Typography>
            <Slider
              value={orbitalRadius}
              onChange={(_, v) => setOrbitalRadius(v as number)}
              min={60}
              max={420}
              step={5}
              size="small"
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Size — {size}
            </Typography>
            <Slider
              value={size}
              onChange={(_, v) => setSize(v as number)}
              min={1}
              max={10}
              step={0.5}
              size="small"
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Eccentricity — {eccentricity.toFixed(2)} ({eccentricityLabel})
            </Typography>
            <Slider
              value={eccentricity}
              onChange={(_, v) => setEccentricity(v as number)}
              min={0}
              max={0.85}
              step={0.01}
              size="small"
            />
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              Starting angle — {Math.round((startAngle * 180) / Math.PI)}°
            </Typography>
            <Slider
              value={startAngle}
              onChange={(_, v) => setStartAngle(v as number)}
              min={0}
              max={Math.PI * 2 - 0.01}
              step={0.05}
              size="small"
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={hasRing}
                onChange={(e) => setHasRing(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Saturn-like ring</Typography>}
          />

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <canvas
              ref={previewRef}
              width={220}
              height={220}
              style={{
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add Planet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
