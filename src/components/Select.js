import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { countries } from "../regions";
import { Box } from "@mui/material";
import { usePost } from "../hooks/postContext";

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
          MenuProps={MenuProps}
          sx={{ color: "#fff" }}
          role="listbox"
        >
          {Array.from(countries)
            .sort((a, b) => a.country.localeCompare(b.country))
            .map((region) => (
              <MenuItem
                role="option"
                key={region.key}
                value={region.key.toLowerCase()}
              >
                <ListItemText aria-label="country" primary={region.country} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
