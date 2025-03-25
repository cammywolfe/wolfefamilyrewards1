import React from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function NavigationMenu({ options, anchorEl, onClose, onSelect }) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      {options.map((option, index) => (
        <MenuItem key={index} onClick={() => onSelect(option)}>
          {option.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default NavigationMenu;
