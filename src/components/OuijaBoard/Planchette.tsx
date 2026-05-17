import { Box } from "@mui/material";

export type PlanchetteProps = {
  x: number;
  y: number;
};

export default function Planchette({ x, y }: PlanchetteProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        width: 100,
        height: 100,
        transition: "all 0.6s ease-in-out",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            clipPath:
              "polygon(50% 0%, 100% 35%, 85% 85%, 50% 100%, 15% 85%, 0% 35%)",
            background: "linear-gradient(135deg, #8b6f47 0%, #6b5435 100%)",
            border: "2px solid #4a2818",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.2)",
            WebkitMaskImage:
              "radial-gradient(circle 28px at 50% 50%, transparent 0%, transparent 100%, black 100%)",
            maskImage:
              "radial-gradient(circle 28px at 50% 50%, transparent 0%, transparent 100%, black 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(173, 216, 230, 0.3) 0%, rgba(135, 206, 250, 0.2) 50%, rgba(100, 149, 237, 0.15) 100%)",
            border: "3px solid #2c1810",
            boxShadow:
              "0 0 12px rgba(135, 206, 250, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.4), inset 0 -2px 6px rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>
    </Box>
  );
}
