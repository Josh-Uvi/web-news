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
import StreetviewOutlinedIcon from "@mui/icons-material/StreetviewOutlined";

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
        <StreetviewOutlinedIcon fontSize="large" />
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
            <ListItem key={article.category} disablePadding>
              <ListItemButton
                key={index}
                selected={context.category == article.category ? true : false}
                onClick={(e) => {
                  e.preventDefault();
                  context.setCategory(article.category);
                  const apiUrl =
                    process.env.NODE_ENV !== "production"
                      ? `/api/news?country=${context.country}&category=${article.category}`
                      : `/.netlify/functions/api/news?country=${context.country}&category=${article.category}`;
                  context.setUrl(apiUrl);
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
