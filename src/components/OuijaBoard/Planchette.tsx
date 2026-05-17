import { Box } from "@mui/material";

export type PlanchetteStyle = "wooden" | "spectral";

export type PlanchetteProps = {
  x: number;
  y: number;
  style?: PlanchetteStyle;
};

export default function Planchette({
  x,
  y,
  style = "wooden",
}: PlanchetteProps) {
  if (style === "spectral") {
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
              background:
                "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.5) 0%, rgba(139, 92, 246, 0.4) 100%)",
              border: "2px solid rgba(59, 130, 246, 0.7)",
              boxShadow:
                "0 0 30px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(139, 92, 246, 0.4)",
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
                "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(173, 216, 230, 0.5) 50%, rgba(59, 130, 246, 0.3) 100%)",
              border: "2px solid rgba(255, 255, 255, 0.6)",
              boxShadow:
                "0 0 20px rgba(255, 255, 255, 0.9), inset 0 0 15px rgba(173, 216, 230, 0.6)",
            }}
          />
        </Box>
      </Box>
    );
  }

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
