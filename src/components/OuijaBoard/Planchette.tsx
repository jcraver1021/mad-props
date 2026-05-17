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
        width: 80,
        height: 80,
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
            borderRadius: "50% 50% 0 0",
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))",
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "primary.main",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.8)",
          }}
        />
      </Box>
    </Box>
  );
}
