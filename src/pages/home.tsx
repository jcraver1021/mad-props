import { Box, Container, Grid, Typography } from "@mui/material";
import AppCard from "../components/AppCard/AppCard";

function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
          }}
        >
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Half-baked experiments
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              A collection of prototypes and test applications
            </Typography>
          </Box>

          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: "center",
            }}
          >
            <Grid item>
              <AppCard
                name="Example"
                to="/example"
                description="A sample experiment page"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
