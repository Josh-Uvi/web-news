import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";

// local imports
import MediaCard from "../component/Card";
import Navbar from "../component/Navbar";
import DrawerComponent from "../component/Drawer";
import { usePost } from "../hooks/postContext";

function Home() {
  const { error, loading, data } = usePost();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <DrawerComponent />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: matches ? 8 : theme.spacing(4),
          m: matches ? 4 : theme.spacing(8),
        }}
      >
        {error && (
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
        )}
        {loading && (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
        {data && (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="center"
            alignItems="center"
          >
            {Array.from(data.articles).map((article, index) => (
              <Grid item xs={6} sm={6} md={4} key={index}>
                <MediaCard data={article} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default Home;
