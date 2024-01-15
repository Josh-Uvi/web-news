import React from "react";
import { useTheme } from "@emotion/react";
import { usePost } from "../hooks/postContext";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";

import categories from "../categories";

const DrawerItem = () => {
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

export default DrawerItem;
