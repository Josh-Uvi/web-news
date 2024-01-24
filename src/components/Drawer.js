import React, { useContext } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";

import { ThemeContext } from "../hooks/themeContext";
import DrawerItem from "./DrawerItem";

const drawerWidth = 240;

const DrawerComponent = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { mobileOpen, toggleDrawer } = useContext(ThemeContext);

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {matches ? (
        <Drawer
          variant={"temporary"}
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerItem />
        </Drawer>
      ) : (
        <Drawer
          variant={"permanent"}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <DrawerItem />
        </Drawer>
      )}
    </Box>
  );
};

export default DrawerComponent;
