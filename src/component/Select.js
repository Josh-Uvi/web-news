import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { countries } from "../regions";
import { Box } from "@mui/material";
import { API_ENDPOINT, usePost } from "../hooks/postContext";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectComponent() {
  const context = usePost();

  const handleChange = ({ target }) => {
    const { value } = target;
    context.setUrl(`${API_ENDPOINT}${value}&category=${context.category}`);
    context.setCountry(value);
  };

  return (
    <Box
      component="div"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
          id="demo-simple-select-standard"
          value={context.country}
          onChange={handleChange}
          label="Regions"
          MenuProps={MenuProps}
          sx={{ color: "#fff" }}
        >
          {Array.from(countries)
            .sort((a, b) => a.country.localeCompare(b.country))
            .map((region) => (
              <MenuItem key={region.key} value={region.key.toLowerCase()}>
                <ListItemText primary={region.country} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}

{
  /* <FormControl sx={{ m: 1, width: 300 }}>
<InputLabel id="demo-multiple-checkbox-label">Regions</InputLabel>
<Select
  labelId="demo-multiple-checkbox-label"
  id="demo-multiple-checkbox"
  label="Regions"
  value={personName}
  onChange={handleChange}
  input={<OutlinedInput label="Regions" />}
  MenuProps={MenuProps}
>
  {regions.sort().map((country, index) => (
    <MenuItem key={index} value={country}>
      <ListItemText primary={country} />
    </MenuItem>
  ))}
</Select>
</FormControl> */
}
