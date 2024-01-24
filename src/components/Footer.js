import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
      }}
      component="footer"
    >
      <Container maxWidth="sm">
        <Typography variant="body1" color="text.secondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://github.com/Josh-Uvi/web-news">
            Josh Uvi
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </Box>
  );
}
