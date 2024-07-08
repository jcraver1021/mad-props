import { Card, CardActionArea, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

export type AppCardProps = {
  name: string;
  to: string;
};

export default function AppCard({ name, to }: AppCardProps) {
  return (
    <Card
      sx={{
        height: 150,
        width: 150,
      }}
    >
      <CardActionArea
        component={Link}
        to={to}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <CardContent>{name}</CardContent>
      </CardActionArea>
    </Card>
  );
}
