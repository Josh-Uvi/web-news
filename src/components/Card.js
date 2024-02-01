import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import cardImg from "../assets/background.png";
import { formatTime } from "../hooks/helpers";

export default function MediaCard({ data }) {
  return (
    <Card
      sx={{
        minWidth: "20vw",
        height: "100%",
        boxShadow: 3,
        borderRadius: 2,
        ":hover": {
          boxShadow: 20,
        },
      }}
      orientation="vertical"
      size="lg"
      variant="soft"
    >
      <CardMedia
        sx={{ objectFit: "cover" }}
        image={data.image === "None" ? cardImg : data.image ?? cardImg}
        alt={data.title}
        height="240"
        component="img"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {data.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {data.description == "text/plain..." ? null : data.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Typography>{formatTime(data.published)}</Typography>
        <Button
          href={data.url}
          size="small"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textTransform: "capitalize",
          }}
        >
          continue reading
        </Button>
      </CardActions>
    </Card>
  );
}
