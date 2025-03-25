import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function TotalsPage({ profile, onBackToMenu, onBackToTracker, onLogout }) {
  const [totals, setTotals] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    const savedTotals = JSON.parse(localStorage.getItem("totals")) || {};
    setTotals(savedTotals[profile.name] || []);
  }, [profile.name]);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const totalSum = totals.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  return (
    <Box p={3} style={{ background: "#e3f2fd", minHeight: "100vh" }}>
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Weekly Totals for {profile.name}
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onBackToTracker();
              }}
            >
              Back to Tracker
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onBackToMenu();
              }}
            >
              Main Menu
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                if (onLogout) {
                  onLogout();
                }
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount ($)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totals.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      /* Add edit/delete actions here if needed */
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Lifetime Total: ${totalSum.toFixed(2)}
      </Typography>
    </Box>
  );
}

export default TotalsPage;
