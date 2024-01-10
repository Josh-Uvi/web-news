import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import regions from "../regions";
import { Box, Typography } from "@mui/material";

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
  const [country, setCountry] = React.useState("United Kingdom");

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCountry(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
          value={country}
          onChange={handleChange}
          label="Regions"
          MenuProps={MenuProps}
          sx={{ color: "#fff" }}
        >
          {regions.sort().map((region, index) => (
            <MenuItem key={index} value={region}>
              <ListItemText primary={region} />
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
