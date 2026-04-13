import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

// local imports
import MediaCard from "../components/Card";
import Navbar from "../components/Navbar";
import DrawerComponent from "../components/Drawer";
import { usePost } from "../hooks/postContext";
import Footer from "../components/Footer";
import { formatTime } from "../hooks/helpers";

const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

const formatLabel = (value) => {
  if (!value) return "Top stories";
  return String(value)
    .split(/[-_\s]+/)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const getArticleImage = (article) => {
  const image = article?.image;

  if (!image) return null;

  const normalizedImage = String(image).trim().toLowerCase();
  return ["", "null", "undefined", "none"].includes(normalizedImage)
    ? null
    : image;
};

function Home() {
  const { error, loading, data, isError, category, country } = usePost();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const articles = Array.isArray(data) ? data : [];
  const featuredArticle = articles[0];
  const secondaryArticles = featuredArticle ? articles.slice(1) : articles;
  const spotlightArticles = secondaryArticles.slice(0, 3);
  const latestArticles = secondaryArticles.length > 0 ? secondaryArticles : articles;
  const featuredImage = getArticleImage(featuredArticle);
  const featuredUrl = isValidUrl(featuredArticle?.url) ? featuredArticle.url : "#";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #f5f7fb 0%, #ffffff 30%, #f8fafc 100%)"
            : "linear-gradient(180deg, #0f172a 0%, #111827 36%, #020617 100%)",
      }}
    >
      <Box display={"flex"}>
        <CssBaseline />
        <Navbar />
        <DrawerComponent />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: matches ? 10 : theme.spacing(6),
            px: matches ? 2 : theme.spacing(6),
            pb: matches ? 4 : theme.spacing(6),
          }}
          minWidth="sm"
        >
          {isError && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="overline" color="error.main" sx={{ fontWeight: 700 }}>
                News feed unavailable
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, mb: 1.5, fontWeight: 800 }}>
                We couldn&apos;t load your latest briefing.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {error.message}
              </Typography>
            </Paper>
          )}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "60vh",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <CircularProgress size={50} />
              <Typography variant="body1" color="text.secondary">
                Building your personalised news briefing...
              </Typography>
            </Box>
          )}
          {data && (
            // set marginTop: 5 to desktop and remove it on mobile views to avoid double margin
            <Stack spacing={{ xs: 4, md: 5 }} sx={{ mt: { xs: 0, md: 5 } }}>
              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: { xs: 4, md: 6 },
                  border: `1px solid ${theme.palette.divider}`,
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(135deg, rgba(25,118,210,0.10) 0%, rgba(255,255,255,0.96) 40%, rgba(25,118,210,0.05) 100%)"
                      : "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(15,23,42,0.94) 45%, rgba(30,41,59,0.98) 100%)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(59,130,246,0.20), transparent 30%), radial-gradient(circle at bottom left, rgba(14,165,233,0.14), transparent 26%)",
                    pointerEvents: "none",
                  }}
                />
                <Grid container spacing={{ xs: 3, md: 4 }} sx={{ position: "relative", p: { xs: 3, md: 4 } }}>
                  <Grid item xs={12} lg={8}>
                    <Stack spacing={3} sx={{ height: "100%" }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
                        <Chip
                          icon={<TrendingUpRoundedIcon />}
                          label="Live briefing"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                        <Chip
                          icon={<LocalOfferRoundedIcon />}
                          label={formatLabel(category)}
                          variant="outlined"
                        />
                        <Chip
                          icon={<PublicRoundedIcon />}
                          label={String(country).toUpperCase()}
                          variant="outlined"
                        />
                      </Stack>

                      <Box>
                        <Typography
                          variant="overline"
                          sx={{
                            letterSpacing: "0.18em",
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          Editor&apos;s pick
                        </Typography>
                        <Typography
                          variant={matches ? "h3" : "h2"}
                          sx={{
                            mt: 1,
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                            maxWidth: 900,
                          }}
                        >
                          {featuredArticle?.title || "Today&apos;s biggest stories, curated for you."}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ mt: 2, maxWidth: 820, lineHeight: 1.7, fontWeight: 400 }}
                        >
                          {featuredArticle?.description && featuredArticle.description !== "text/plain..."
                            ? featuredArticle.description
                            : "Stay on top of breaking developments, business moves, and global conversations with a cleaner, faster way to scan the latest headlines."}
                        </Typography>
                      </Box>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                        <Button
                          variant="contained"
                          size="large"
                          endIcon={<ArrowForwardRoundedIcon />}
                          href={featuredUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!featuredArticle || featuredUrl === "#"}
                          sx={{
                            px: 3,
                            py: 1.4,
                            borderRadius: 999,
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: theme.shadows[6],
                          }}
                        >
                          Read featured story
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          {featuredArticle?.published
                            ? `Updated ${formatTime(featuredArticle.published)}`
                            : `${articles.length} stories available right now`}
                        </Typography>
                      </Stack>

                      <Grid container spacing={2}>
                        {[
                          {
                            label: "Stories loaded",
                            value: String(articles.length).padStart(2, "0"),
                          },
                          {
                            label: "Region",
                            value: String(country).toUpperCase(),
                          },
                          {
                            label: "Desk",
                            value: formatLabel(category),
                          },
                        ].map((item) => (
                          <Grid item xs={12} sm={4} key={item.label}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2.25,
                                height: "100%",
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                backgroundColor: theme.palette.background.paper,
                              }}
                            >
                              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {item.label}
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                {item.value}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Stack spacing={2.5} sx={{ height: "100%" }}>
                      <Paper
                        elevation={0}
                        sx={{
                          minHeight: 260,
                          borderRadius: 4,
                          overflow: "hidden",
                          position: "relative",
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.background.paper,
                          backgroundImage: featuredImage
                            ? `linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0.66) 100%), url(${featuredImage})`
                            : theme.palette.mode === "light"
                              ? "linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #38bdf8 100%)"
                              : "linear-gradient(135deg, #020617 0%, #1e3a8a 55%, #0ea5e9 100%)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            p: 3,
                            color: "common.white",
                            background:
                              "linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.72) 55%, rgba(15,23,42,0.88) 100%)",
                          }}
                        >
                          <Typography variant="overline" sx={{ opacity: 0.82, fontWeight: 700 }}>
                            Lead story
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15, mt: 0.5 }}>
                            {featuredArticle?.title || "A smarter way to read daily news"}
                          </Typography>
                        </Box>
                      </Paper>

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 4,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                          Trending now
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Quick access to the headlines readers are most likely to open next.
                        </Typography>
                        <Stack divider={<Divider flexItem />}> 
                          {spotlightArticles.length > 0 ? (
                            spotlightArticles.map((article, index) => {
                              const articleUrl = isValidUrl(article?.url) ? article.url : "#";

                              return (
                                <Box key={`${article.title}-${index}`} sx={{ py: 1.75 }}>
                                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <Avatar
                                      sx={{
                                        width: 34,
                                        height: 34,
                                        fontSize: "0.9rem",
                                        bgcolor: theme.palette.primary.main,
                                        color: theme.palette.primary.contrastText,
                                        fontWeight: 700,
                                      }}
                                    >
                                      {index + 1}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                      <Link
                                        href={articleUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        underline="none"
                                        color="text.primary"
                                        sx={{
                                          fontWeight: 700,
                                          lineHeight: 1.4,
                                          display: "inline-block",
                                          "&:hover": { color: "primary.main" },
                                        }}
                                      >
                                        {article.title}
                                      </Link>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {article.published ? formatTime(article.published) : "Latest update"}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                              );
                            })
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              New headlines will appear here as soon as your feed is ready.
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              <Box>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={1.5}
                  sx={{ mb: 3 }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                      Latest stories
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                      Browse the newest headlines across {formatLabel(category).toLowerCase()} from {String(country).toUpperCase()}.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${latestArticles.length} articles`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>

                <Grid
                  container
                  spacing={{ xs: 2.5, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  justifyContent="flex-start"
                >
                  {latestArticles.map((article, index) => (
                    <Grid item xs={4} sm={4} md={4} key={`${article.title}-${index}`}>
                      <MediaCard data={article} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Home;
