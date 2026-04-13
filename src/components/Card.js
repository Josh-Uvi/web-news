import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { formatTime } from "../hooks/helpers";

// HIGH: URL validation for external links
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

const hasValidArticleImage = (image) => {
  if (!image) return false;

  const normalizedImage = String(image).trim().toLowerCase();

  return !["none", "null", "undefined", ""].includes(normalizedImage);
};

export default function MediaCard({ data }) {
  const theme = useTheme();
  const [imageLoadError, setImageLoadError] = React.useState(false);

  React.useEffect(() => {
    setImageLoadError(false);
  }, [data.image]);

  const handleLinkClick = (e) => {
    if (!data.url || !isValidUrl(data.url)) {
      e.preventDefault();
      console.warn('Invalid or missing URL');
    }
  };

  const safeUrl = data.url && isValidUrl(data.url) ? data.url : '#';
  const shouldShowFallback = !hasValidArticleImage(data.image) || imageLoadError;

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
      {shouldShowFallback ? (
        <Box
          sx={{
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 3 },
            py: 3,
            textAlign: "center",
            background: theme.palette.mode === "light"
              ? "linear-gradient(135deg, #d32f2f 0%, #f44336 55%, #ff7961 100%)"
              : "linear-gradient(135deg, #7f0000 0%, #b71c1c 55%, #d32f2f 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0) 60%)",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                mb: 1.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                backgroundColor: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              Latest Update
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                wordBreak: "break-word",
              }}
            >
              Break News
            </Typography>
          </Box>
        </Box>
      ) : (
        <CardMedia
          sx={{ objectFit: "cover" }}
          image={data.image}
          alt={data.title}
          height="240"
          component="img"
          fetchpriority="high"
          loading="lazy"
          onError={() => {
            setImageLoadError(true);
          }}
        />
      )}
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
          href={safeUrl}
          size="small"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
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