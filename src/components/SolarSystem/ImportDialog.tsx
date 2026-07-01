import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { SolarSystemFile } from "../../common/physics/solarSystemFormat";
import { PRESETS } from "../../common/physics/presets";

// ── Preset card ───────────────────────────────────────────────────────────────

interface PresetCardProps {
  system: SolarSystemFile;
  onSelect: (file: SolarSystemFile) => void;
}

function PresetCard({ system, onSelect }: PresetCardProps) {
  const planets = system.planets;
  const maxSMA = Math.max(...planets.map((p) => p.semiMajorAxis));
  // Use sqrt scale so inner and outer planets are both visible
  const sqrtMax = Math.sqrt(maxSMA);
  const scale = 36 / sqrtMax;

  return (
    <Box
      onClick={() => onSelect(system)}
      sx={{
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
        p: 1.5,
        display: "flex",
        gap: 2,
        alignItems: "center",
        transition: "all 0.15s",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.05)",
          borderColor: "rgba(100,200,255,0.5)",
        },
      }}
    >
      {/* Mini orbit diagram */}
      <svg
        width={80}
        height={80}
        style={{ flexShrink: 0, borderRadius: 6, overflow: "hidden" }}
      >
        <rect width={80} height={80} fill="#050d1a" rx={6} />
        {/* Orbits (sqrt-scaled) */}
        {planets.map((p, i) => {
          const r = Math.sqrt(p.semiMajorAxis) * scale;
          const rx = r * (1 + p.eccentricity * 0.5);
          const ry =
            r * Math.sqrt(Math.max(0.01, 1 - p.eccentricity * p.eccentricity));
          return (
            <ellipse
              key={i}
              cx={40}
              cy={40}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={p.color}
              strokeWidth={0.9}
              strokeOpacity={0.55}
            />
          );
        })}
        {/* Star */}
        <circle cx={40} cy={40} r={4} fill={system.star.color} />
      </svg>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {system.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", lineHeight: 1.4 }}
        >
          {system.description}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.4, opacity: 0.7 }}
        >
          {planets.length} planet{planets.length !== 1 ? "s" : ""} ·{" "}
          {system.star.name}
        </Typography>
      </Box>
    </Box>
  );
}

// ── ImportDialog ──────────────────────────────────────────────────────────────

export interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: SolarSystemFile) => void;
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (file: SolarSystemFile) => {
    onImport(file);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as SolarSystemFile;
        if (data.version !== "1.0") throw new Error("Unsupported version");
        handleSelect(data);
      } catch {
        alert("Could not parse solar system file — make sure it's valid JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Import Solar System</DialogTitle>
      <DialogContent>
        <Stack spacing={1.25} sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Pick a preset or load a saved .json file
          </Typography>

          {PRESETS.map((system) => (
            <PresetCard
              key={system.name}
              system={system}
              onSelect={handleSelect}
            />
          ))}

          <Divider sx={{ my: 0.5 }} />

          <Tooltip title="Load a previously exported .json file">
            <Button
              variant="outlined"
              size="small"
              onClick={() => fileInputRef.current?.click()}
            >
              Open .json file…
            </Button>
          </Tooltip>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
