import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import cardImg from "../assets/background.png";

export default function MediaCard({ data }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        boxShadow: 3,
        borderRadius: 2,
        ":hover": {
          boxShadow: 20,
        },
      }}
    >
      <CardMedia
        sx={{ height: 200, objectFit: "cover" }}
        image={data.image === "None" ? cardImg : data.image ?? cardImg}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Read More</Button>
      </CardActions>
    </Card>
  );
}
