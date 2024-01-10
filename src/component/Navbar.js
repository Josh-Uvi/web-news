import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SelectComponent from "./Select";

const drawerWidth = 240;

const Navbar = ({ handleDrawerToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          size="large"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Web News
        </Typography>
        <SelectComponent />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
