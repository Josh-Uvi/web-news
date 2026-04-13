import * as React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";

import { usePost } from "../hooks/postContext";

const PROVIDER_LABELS = {
  currentsapi: "Currents API",
  newsapi: "NewsAPI",
};

const formatProviderLabel = (provider) => {
  if (!provider) return "Unavailable";
  return PROVIDER_LABELS[provider] || provider;
};

export default function ProviderSelect() {
  const {
    provider,
    activeProvider,
    defaultProvider,
    availableProviders,
    setProvider,
    isFetching,
  } = usePost();

  if (!Array.isArray(availableProviders) || availableProviders.length === 0) {
    return null;
  }

  const currentValue = provider || activeProvider || availableProviders[0];
  const isFallbackActive = Boolean(provider && activeProvider && provider !== activeProvider);

  const handleChange = (event) => {
    setProvider(event.target.value);
  };

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Typography
        variant="overline"
        sx={{ display: "flex", alignItems: "center", gap: 0.75, fontWeight: 700, letterSpacing: "0.08em" }}
      >
        <SyncAltRoundedIcon sx={{ fontSize: 16 }} />
        News provider
      </Typography>

      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel id="news-provider-select-label">Provider</InputLabel>
        <Select
          labelId="news-provider-select-label"
          id="news-provider-select"
          value={currentValue}
          label="Provider"
          onChange={handleChange}
        >
          {availableProviders.map((providerName) => (
            <MenuItem key={providerName} value={providerName}>
              {formatProviderLabel(providerName)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
        <Chip
          size="small"
          color="primary"
          variant="filled"
          label={`Active: ${formatProviderLabel(activeProvider || currentValue)}`}
        />
        {defaultProvider && defaultProvider !== activeProvider && (
          <Chip
            size="small"
            variant="outlined"
            label={`Default: ${formatProviderLabel(defaultProvider)}`}
          />
        )}
        {isFetching && <Chip size="small" variant="outlined" label="Refreshing" />}
      </Stack>

      {isFallbackActive && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Active feed switched to {formatProviderLabel(activeProvider)} because the selected provider is currently rate-limited.
        </Typography>
      )}
    </Box>
  );
}