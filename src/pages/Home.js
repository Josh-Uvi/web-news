import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MediaCard from "../component/Card";
import Navbar from "../component/Navbar";
import { Grid } from "@mui/material";
import DrawerItem from "../component/Drawer";

function Home(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  // Remove this const when copying and pasting into your project.
  let container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <DrawerItem
        container={container}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={6} sm={6} md={4} key={index}>
              <MediaCard />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
