import React, { useContext } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";

import categories from "../categories";
import { API_ENDPOINT, usePost } from "../hooks/postContext";
import { ThemeContext } from "../hooks/themeContext";

const drawerWidth = 240;

const DrawerComponent = () => {
  const context = usePost();
  const theme = useTheme();
  return (
    <Box sx={{ overflow: "auto" }}>
      <Toolbar
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? "#1976d2" : "#272727",
          color: "#fff",
        }}
      >
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
        {Array.from(categories)
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((article, index) => (
            <ListItem key={article.category} disablePadding className="">
              <ListItemButton
                key={index}
                selected={context.category == article.category ? true : false}
                onClick={(e) => {
                  e.preventDefault();
                  context.setUrl(
                    `/api?country=${context.country}&category=${article.category}`
                  );
                  context.setCategory(article.category);
                }}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                  },
                }}
              >
                <ListItemIcon>{article.icon}</ListItemIcon>
                <ListItemText
                  sx={{ textTransform: "capitalize" }}
                  primary={article.category}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

const DrawerItem = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const { mobileOpen, toggleDrawer } = useContext(ThemeContext);

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
          <DrawerComponent />
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
          <DrawerComponent />
        </Drawer>
      )}
    </Box>
  );
};

export default DrawerItem;
