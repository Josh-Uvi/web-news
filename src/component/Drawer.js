import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import categories from "../categories";

const drawerWidth = 240;

const drawer = (
  <Box sx={{ overflow: "auto" }}>
    <Toolbar sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        App icon
      </Typography>
    </Toolbar>
    <Divider />
    <List
      subheader={
        <ListSubheader
          sx={{ fontWeight: "700", fontSize: 16, textTransform: "uppercase" }}
          component="div"
          id="nested-list-subheader"
        >
          Categories
        </ListSubheader>
      }
    >
      {categories.sort() &&
        categories.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                sx={{ textTransform: "capitalize" }}
                primary={text}
              />
            </ListItemButton>
          </ListItem>
        ))}
    </List>
  </Box>
);

const DrawerItem = ({ container, mobileOpen, handleDrawerToggle }) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
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
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default DrawerItem;
