import { Box, Typography } from "@mui/material";

export type MessageScrollProps = {
  message: string;
  expectedLength?: number;
};

export default function MessageScroll({
  message,
  expectedLength,
}: MessageScrollProps) {
  const charWidth = 24;
  const basePadding = 48;
  const calculatedWidth = expectedLength
    ? Math.min(Math.max(charWidth * expectedLength + basePadding, 200), 800)
    : undefined;

  return (
    <Box
      sx={{
        mt: 4,
        background:
          "linear-gradient(135deg, #e8d4b8 0%, #d4c4a8 50%, #c8b898 100%)",
        borderRadius: "8px",
        border: "3px solid #4a2818",
        p: 3,
        minHeight: 80,
        width: calculatedWidth,
        maxWidth: 800,
        transition: "width 0.3s ease-in-out",
        boxShadow:
          "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 8,
          left: 8,
          right: 8,
          bottom: 8,
          border: "2px solid rgba(74, 40, 24, 0.3)",
          borderRadius: "4px",
          pointerEvents: "none",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Cinzel', 'Georgia', serif",
          fontSize: "1.5rem",
          color: "#1a0f08",
          textAlign: "left",
          letterSpacing: "0.15em",
          wordSpacing: "0.3em",
          minHeight: "2rem",
          fontWeight: 500,
          textShadow: "1px 1px 2px rgba(139, 69, 19, 0.2)",
        }}
      >
        {message || " "}
      </Typography>
    </Box>
  );
}
