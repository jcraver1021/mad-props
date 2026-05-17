import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export type AppCardProps = {
  name: string;
  to: string;
  description?: string;
};

export default function AppCard({ name, to, description }: AppCardProps) {
  return (
    <Card
      sx={{
        height: 200,
        width: 280,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={to}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            p: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
