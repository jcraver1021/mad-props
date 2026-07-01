import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Slider,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Vec2D } from "../../common/math/vec2d";
import {
  createPlanet,
  DEFAULT_PLANET_CONFIGS,
  DEFAULT_STAR,
  gravAccel,
  orbitalPeriod,
  PlanetConfig,
  SimPlanet,
  Star,
  stepSimulation,
} from "../../common/physics/orbital";
import {
  exportSolarSystem,
  importSolarSystem,
  SolarSystemFile,
} from "../../common/physics/solarSystemFormat";
import { AddPlanetDialog } from "./AddPlanetDialog";
import {
  drawBackground,
  drawFreeformPreview,
  drawOrbitGuides,
  drawPlanets,
  drawStar,
  drawTrails,
} from "./canvasDraw";
import {
  PLANET_COLORS,
  TRAIL_MAX,
  TRAIL_SAMPLE_EVERY,
  VSCALE,
} from "./constants";
import { ImportDialog } from "./ImportDialog";
import { BgStar, FreeformDrag, PlanetMeta } from "./types";

// ── Main component ────────────────────────────────────────────────────────────

export default function SolarSystem() {
  // ── Refs: physics & animation (mutated directly — no re-render) ─────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const idRef = useRef<number>(0);
  const freeformCountRef = useRef<number>(0);

  const planetsRef = useRef<SimPlanet[]>([]);
  const trailsRef = useRef<Map<string, Vec2D[]>>(new Map());
  const starRef = useRef<Star>(DEFAULT_STAR);

  // Settings mirrors (kept in sync with React state so the RAF loop sees them)
  const isRunningRef = useRef(true);
  const simSpeedRef = useRef(5);
  const showTrailsRef = useRef(true);
  const showLabelsRef = useRef(true);
  const showOrbitsRef = useRef(true);
  const nBodyRef = useRef(false);
  const freeformModeRef = useRef(false);

  const freeformDragRef = useRef<FreeformDrag>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  // ── React state: sidebar UI ─────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(5);
  const [showTrails, setShowTrails] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [nBody, setNBody] = useState(false);
  const [freeformMode, setFreeformMode] = useState(false);
  const [planetMetas, setPlanetMetas] = useState<PlanetMeta[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [systemName, setSystemName] = useState("Solar System");
  const [starMass, setStarMass] = useState(DEFAULT_STAR.mass);

  // Keep refs in sync with state
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);
  useEffect(() => {
    simSpeedRef.current = simSpeed;
  }, [simSpeed]);
  useEffect(() => {
    showTrailsRef.current = showTrails;
  }, [showTrails]);
  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);
  useEffect(() => {
    showOrbitsRef.current = showOrbits;
  }, [showOrbits]);
  useEffect(() => {
    nBodyRef.current = nBody;
  }, [nBody]);
  useEffect(() => {
    freeformModeRef.current = freeformMode;
  }, [freeformMode]);

  // Stable background stars
  const bgStars = useMemo<BgStar[]>(
    () =>
      Array.from({ length: 280 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.55 + 0.15,
      })),
    [],
  );

  // ── Planet management ───────────────────────────────────────────────────────

  const addPlanet = useCallback((config: PlanetConfig) => {
    const id = String(++idRef.current);
    const planet = createPlanet(config, starRef.current, id);
    planetsRef.current = [...planetsRef.current, planet];
    trailsRef.current.set(id, []);
    setPlanetMetas((prev) => [
      ...prev,
      {
        id,
        name: config.name,
        color: config.color,
        orbitalRadius: config.orbitalRadius,
        eccentricity: config.eccentricity,
        startAngle: config.startAngle,
      },
    ]);
  }, []);

  const removePlanet = useCallback((id: string) => {
    planetsRef.current = planetsRef.current.filter((p) => p.id !== id);
    trailsRef.current.delete(id);
    setPlanetMetas((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Import ──────────────────────────────────────────────────────────────────

  const loadSystem = useCallback((file: SolarSystemFile) => {
    const canvas = canvasRef.current;
    const result = importSolarSystem(
      file,
      canvas?.width ?? 800,
      canvas?.height ?? 600,
    );

    planetsRef.current = [];
    trailsRef.current.clear();
    idRef.current = 0;
    freeformCountRef.current = 0;
    lastTRef.current = 0;

    starRef.current = result.star;
    setSystemName(result.systemName);
    setStarMass(result.star.mass);
    setPlanetMetas([]);

    result.configs.forEach((cfg) => {
      const id = String(++idRef.current);
      const planet = createPlanet(cfg, result.star, id);
      planetsRef.current = [...planetsRef.current, planet];
      trailsRef.current.set(id, []);
      setPlanetMetas((prev) => [
        ...prev,
        {
          id,
          name: cfg.name,
          color: cfg.color,
          orbitalRadius: cfg.orbitalRadius,
          eccentricity: cfg.eccentricity,
          startAngle: cfg.startAngle,
        },
      ]);
    });
  }, []);

  // ── Export ──────────────────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    const file = exportSolarSystem(
      systemName,
      starRef.current,
      planetsRef.current,
      planetMetas,
    );
    const blob = new Blob([JSON.stringify(file, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${systemName.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [systemName, planetMetas]);

  // Seed default planets once
  useEffect(() => {
    DEFAULT_PLANET_CONFIGS.forEach(addPlanet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Canvas resize ───────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Freeform mouse handlers ─────────────────────────────────────────────────

  const getStarRelPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x:
        (e.clientX - rect.left) * (canvas.width / rect.width) -
        canvas.width / 2,
      y:
        (e.clientY - rect.top) * (canvas.height / rect.height) -
        canvas.height / 2,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!freeformModeRef.current) return;
    const pos = getStarRelPos(e);
    const sr = starRef.current.visualRadius + 8;
    if (pos.x * pos.x + pos.y * pos.y < sr * sr) return;
    freeformDragRef.current = {
      isDragging: true,
      startX: pos.x,
      startY: pos.y,
      currentX: pos.x,
      currentY: pos.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!freeformDragRef.current.isDragging) return;
    const pos = getStarRelPos(e);
    freeformDragRef.current.currentX = pos.x;
    freeformDragRef.current.currentY = pos.y;
  };

  const handleMouseUp = () => {
    const drag = freeformDragRef.current;
    if (!drag.isDragging) return;
    drag.isDragging = false;

    const id = String(++idRef.current);
    const idx = freeformCountRef.current++;
    const color = PLANET_COLORS[idx % PLANET_COLORS.length];
    const name = `Body ${idx + 1}`;
    const position = new Vec2D(drag.startX, drag.startY);

    const planet: SimPlanet = {
      id,
      name,
      mass: 20,
      visualRadius: 4.5,
      color,
      position,
      velocity: new Vec2D(
        (drag.currentX - drag.startX) * VSCALE,
        (drag.currentY - drag.startY) * VSCALE,
      ),
      acceleration: gravAccel(
        position,
        starRef.current.position,
        starRef.current.mass,
      ),
    };
    planetsRef.current = [...planetsRef.current, planet];
    trailsRef.current.set(id, []);
    const r = Math.sqrt(drag.startX ** 2 + drag.startY ** 2);
    setPlanetMetas((prev) => [
      ...prev,
      { id, name, color, orbitalRadius: r, eccentricity: 0 },
    ]);
  };

  const handleMouseLeave = () => {
    freeformDragRef.current.isDragging = false;
  };

  // ── Animation loop ──────────────────────────────────────────────────────────

  const animate = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { width: W, height: H } = canvas;
      const cx = W / 2;
      const cy = H / 2;

      // Physics
      if (isRunningRef.current && lastTRef.current > 0) {
        const realDt = Math.min((ts - lastTRef.current) / 1000, 0.05);
        const simDt = realDt * simSpeedRef.current;
        let rem = simDt;
        const maxStep = 0.016;
        while (rem > 0 && planetsRef.current.length > 0) {
          const dt = Math.min(rem, maxStep);
          planetsRef.current = stepSimulation(
            planetsRef.current,
            starRef.current,
            nBodyRef.current,
            dt,
          );
          rem -= dt;
        }
      }
      lastTRef.current = ts;
      frameRef.current++;

      // Trail sampling
      if (
        showTrailsRef.current &&
        frameRef.current % TRAIL_SAMPLE_EVERY === 0
      ) {
        for (const p of planetsRef.current) {
          const trail = trailsRef.current.get(p.id) ?? [];
          trail.push(p.position.clone());
          if (trail.length > TRAIL_MAX) trail.shift();
          trailsRef.current.set(p.id, trail);
        }
      }

      // Draw
      drawBackground(ctx, W, H, bgStars);
      if (showOrbitsRef.current)
        drawOrbitGuides(ctx, cx, cy, planetsRef.current);
      if (showTrailsRef.current)
        drawTrails(ctx, cx, cy, planetsRef.current, trailsRef.current);
      drawStar(ctx, cx, cy, starRef.current, ts);
      drawPlanets(ctx, cx, cy, planetsRef.current, showLabelsRef.current);

      // Freeform overlay
      if (freeformModeRef.current) {
        const drag = freeformDragRef.current;
        if (drag.isDragging) {
          drawFreeformPreview(ctx, cx, cy, drag, starRef.current.mass);
        } else {
          ctx.font = "12px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillStyle = "rgba(100,210,255,0.35)";
          ctx.fillText(
            "Click & drag to place a body  —  drag length sets velocity",
            cx,
            H - 16,
          );
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    },
    [bgStars],
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#050d1a",
        overflow: "hidden",
      }}
    >
      {/* Canvas */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            cursor: freeformMode ? "crosshair" : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
        <Button
          component={Link}
          to="/"
          variant="outlined"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backdropFilter: "blur(6px)",
            bgcolor: "rgba(5,13,26,0.6)",
          }}
        >
          ← Home
        </Button>
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.45,
            pointerEvents: "none",
            letterSpacing: 2,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {systemName}
        </Typography>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderLeft: "1px solid rgba(59,130,246,0.2)",
          flexShrink: 0,
        }}
      >
        {/* Controls section */}
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Controls
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Tooltip
              title={isRunning ? "Pause simulation" : "Resume simulation"}
            >
              <Button
                variant={isRunning ? "outlined" : "contained"}
                size="small"
                onClick={() => setIsRunning((r) => !r)}
                sx={{ minWidth: 90 }}
              >
                {isRunning ? "⏸ Pause" : "▶ Play"}
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Speed — {simSpeed}×
            </Typography>
            <Slider
              value={simSpeed}
              onChange={(_, v) => setSimSpeed(v as number)}
              min={0.5}
              max={20}
              step={0.5}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showTrails}
                  onChange={(e) => {
                    if (!e.target.checked) trailsRef.current.clear();
                    setShowTrails(e.target.checked);
                  }}
                />
              }
              label={<Typography variant="caption">Trails</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
              }
              label={<Typography variant="caption">Labels</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={showOrbits}
                  onChange={(e) => setShowOrbits(e.target.checked)}
                />
              }
              label={<Typography variant="caption">Orbit guides</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={nBody}
                  onChange={(e) => setNBody(e.target.checked)}
                />
              }
              label={
                <Tooltip title="Enable gravitational attraction between planets.">
                  <Typography
                    variant="caption"
                    sx={{ cursor: "help", textDecoration: "underline dotted" }}
                  >
                    Planet–planet gravity
                  </Typography>
                </Tooltip>
              }
            />
          </Box>
        </Box>

        {/* Bodies section */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.25,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Bodies ({planetMetas.length + 1})
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              <Tooltip title="Click & drag on canvas to place bodies with arbitrary velocities">
                <Button
                  size="small"
                  variant={freeformMode ? "contained" : "outlined"}
                  color="info"
                  onClick={() => setFreeformMode((f) => !f)}
                  sx={{ fontSize: "0.7rem", px: 1 }}
                >
                  {freeformMode ? "✚ Active" : "✚ Freeform"}
                </Button>
              </Tooltip>
              <Button
                size="small"
                variant="contained"
                onClick={() => setAddOpen(true)}
                sx={{ fontSize: "0.7rem", px: 1 }}
              >
                + Add
              </Button>
            </Box>
          </Box>

          {/* Star row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.25,
              borderRadius: 1,
              bgcolor: "rgba(255,200,50,0.08)",
              border: "1px solid rgba(255,200,50,0.2)",
              mb: 0.75,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: `radial-gradient(circle, #FFFDE7, ${starRef.current.color ?? "#FF8F00"})`,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                {starRef.current.name ?? "Star"} ☀
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Star · fixed
              </Typography>
            </Box>
          </Box>

          {/* Planet rows */}
          {planetMetas.map((meta) => {
            const period = orbitalPeriod(
              meta.orbitalRadius,
              meta.eccentricity,
              starMass,
            );
            const realSec = period / simSpeed;
            const periodStr =
              realSec < 60
                ? `~${realSec.toFixed(1)}s orbit`
                : `~${(realSec / 60).toFixed(1)}m orbit`;
            return (
              <Box
                key={meta.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  mb: 0.75,
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
                }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: meta.color,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {meta.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {periodStr}
                  </Typography>
                </Box>
                <Tooltip title="Remove">
                  <Button
                    size="small"
                    onClick={() => removePlanet(meta.id)}
                    sx={{
                      minWidth: 0,
                      p: 0.5,
                      opacity: 0.4,
                      fontSize: "0.75rem",
                      "&:hover": { opacity: 1, color: "error.main" },
                    }}
                  >
                    ✕
                  </Button>
                </Tooltip>
              </Box>
            );
          })}

          {planetMetas.length === 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", mt: 3 }}
            >
              No planets yet
            </Typography>
          )}
        </Box>

        {/* Import / Export */}
        <Box
          sx={{
            p: 1.5,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => setImportOpen(true)}
            sx={{ flex: 1, fontSize: "0.7rem" }}
          >
            ↓ Import
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleExport}
            sx={{ flex: 1, fontSize: "0.7rem" }}
          >
            ↑ Export
          </Button>
        </Box>
      </Box>

      <AddPlanetDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addPlanet}
      />
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={loadSystem}
      />
    </Box>
  );
}
