import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Grid,
  Paper,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigationMenu from "./NavigationMenu"; // Ensure this file exists in /src

// Default tasks and days
const tasks = [
  { name: "Keeping area Clean", type: "M", value: 0.36 },
  { name: "Brushing Teeth", type: "M", value: 0.36 },
  { name: "Picking up dirty clothes", type: "M", value: 0.18 },
  { name: "Following Bedtime Routine", type: "M", value: 0.46 },
  { name: "Getting outside/being active", type: "O", value: 0.26 },
  { name: "Initiating Homework", type: "O", value: 0.58 },
  { name: "Helping with a household chore", type: "O", value: 0.58 },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function ChoreApplication({
  profile,
  userType,
  onBackToMenu,
  onViewTotals,
  onLogout,
}) {
  const [checked, setChecked] = useState({});
  const [dayEnded, setDayEnded] = useState({});
  const [dailyTotals, setDailyTotals] = useState({});
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [endWeekPopupOpen, setEndWeekPopupOpen] = useState(false);

  // Load saved chore data for this profile
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("choreData")) || {};
    if (profile && profile.name && savedData[profile.name]) {
      const profileData = savedData[profile.name];
      setChecked(profileData.checked || {});
      setDayEnded(profileData.dayEnded || {});
      setDailyTotals(profileData.dailyTotals || {});
      setWeeklyTotal(profileData.weeklyTotal || 0);
    }
  }, [profile]);

  // Save chore data whenever it changes
  useEffect(() => {
    if (profile && profile.name) {
      const savedData = JSON.parse(localStorage.getItem("choreData")) || {};
      savedData[profile.name] = {
        checked,
        dayEnded,
        dailyTotals,
        weeklyTotal,
      };
      localStorage.setItem("choreData", JSON.stringify(savedData));
    }
  }, [checked, dayEnded, dailyTotals, weeklyTotal, profile]);

  // For viewers, restrict interaction
  const handleCheck = (day, taskName) => {
    if (userType !== "admin") return;
    setChecked((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [taskName]: !prev[day]?.[taskName],
      },
    }));
  };

  const calculateDayTotal = (day) => {
    return (tasks || []).reduce((total, task) => {
      const isChecked = checked[day]?.[task.name];
      if (task.type === "M") {
        return total + (isChecked ? task.value : -task.value);
      } else if (task.type === "O") {
        return total + (isChecked ? task.value : 0);
      }
      return total;
    }, 0);
  };

  const handleEndDay = (day) => {
    if (userType !== "admin") return;
    const total = Math.max(0, calculateDayTotal(day));
    setDayEnded((prev) => ({ ...prev, [day]: true }));
    setDailyTotals((prev) => {
      const updated = { ...prev, [day]: total };
      setWeeklyTotal(Object.values(updated).reduce((sum, val) => sum + val, 0));
      return updated;
    });
  };

  const handleResetDay = (day) => {
    if (userType !== "admin") return;
    setChecked((prev) => ({ ...prev, [day]: {} }));
    setDayEnded((prev) => ({ ...prev, [day]: false }));
    setDailyTotals((prev) => {
      const updated = { ...prev };
      delete updated[day];
      setWeeklyTotal(Object.values(updated).reduce((sum, val) => sum + val, 0));
      return updated;
    });
  };

  const handleSelectAll = (day) => {
    if (userType !== "admin") return;
    setChecked((prev) => ({
      ...prev,
      [day]: (tasks || []).reduce((acc, task) => {
        acc[task.name] = true;
        return acc;
      }, {}),
    }));
  };

  const handleEndWeek = () => {
    if (userType !== "admin") return;
    setEndWeekPopupOpen(true);
  };

  const handleConfirmEndWeek = () => {
    const newTotal = Object.values(dailyTotals).reduce(
      (sum, val) => sum + val,
      0
    );
    const totalData = JSON.parse(localStorage.getItem("totals")) || {};
    totalData[profile.name] = totalData[profile.name] || [];
    totalData[profile.name].push({
      date: new Date().toLocaleDateString(),
      amount: newTotal,
    });
    localStorage.setItem("totals", JSON.stringify(totalData));
    setEndWeekPopupOpen(false);
    onBackToMenu(); // Navigate to main menu after ending week
  };

  const handleCancelEndWeek = () => {
    setEndWeekPopupOpen(false);
  };

  // Navigation menu handling for ChoreApplication page
  const getMenuOptions = () => {
    if (userType === "admin") {
      return [
        { label: "Back to Menu", action: "backToMenu" },
        { label: "View Totals", action: "viewTotals" },
        { label: "Logout", action: "logout" },
      ];
    } else {
      return [
        { label: "Back to Menu", action: "backToMenu" },
        { label: "View Totals", action: "viewTotals" },
        { label: "Logout", action: "logout" },
      ];
    }
  };

  const [navAnchorEl, setNavAnchorEl] = useState(null);
  const handleMenuOpenForNavigation = (event) => {
    setNavAnchorEl(event.currentTarget);
  };
  const handleMenuCloseForNavigation = () => {
    setNavAnchorEl(null);
  };
  const handleNavigationSelect = (action) => {
    if (action === "backToMenu") {
      onBackToMenu();
    } else if (action === "logout") {
      onLogout();
    } else if (action === "viewTotals") {
      onViewTotals();
    }
    setNavAnchorEl(null);
  };

  return (
    <Box p={3} style={{ background: "#e3f2fd", minHeight: "100vh" }}>
      {/* Navigation Menu at the top */}
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={handleMenuOpenForNavigation}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={navAnchorEl}
          open={Boolean(navAnchorEl)}
          onClose={handleMenuCloseForNavigation}
        >
          {getMenuOptions().map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => handleNavigationSelect(option.action)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        Weekly Chore Tracker for {profile?.name}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography variant="h6">Day</Typography>
        </Grid>
        {(tasks || []).map((task, idx) => (
          <Grid item xs={1} key={idx}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {task.name}
            </Typography>
          </Grid>
        ))}
        <Grid item xs={1}>
          <Typography variant="h6">Daily Total</Typography>
        </Grid>
      </Grid>

      {(days || []).map((day, i) => (
        <Grid container spacing={2} key={i} alignItems="center">
          <Grid item xs={2}>
            <Typography>{day}</Typography>
          </Grid>
          {(tasks || []).map((task, j) => (
            <Grid item xs={1} key={j}>
              <Checkbox
                checked={checked[day]?.[task.name] || false}
                onChange={() => handleCheck(day, task.name)}
                disabled={dayEnded[day] || userType === "viewer"}
              />
            </Grid>
          ))}
          <Grid item xs={1}>
            <Typography>${(dailyTotals[day] ?? 0).toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color={dayEnded[day] ? "secondary" : "primary"}
              onClick={() =>
                dayEnded[day] ? handleResetDay(day) : handleEndDay(day)
              }
              style={{ marginRight: 10 }}
              disabled={userType === "viewer"}
            >
              {dayEnded[day] ? "Reset Day" : "End Day"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSelectAll(day)}
              disabled={dayEnded[day] || userType === "viewer"}
            >
              Select All
            </Button>
          </Grid>
        </Grid>
      ))}

      <Box mt={4}>
        <Typography variant="h5">
          Weekly Total: ${weeklyTotal.toFixed(2)}
        </Typography>
        {userType === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEndWeek}
            disabled={Object.keys(dayEnded).length !== 7}
          >
            End Week
          </Button>
        )}
      </Box>

      {/* End Week Confirmation Popup */}
      {endWeekPopupOpen && (
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            zIndex: 9999,
            background: "white",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6">End Week</Typography>
          <Typography variant="body1">
            Are you sure you want to end the week and save the totals?
          </Typography>
          <Button onClick={handleCancelEndWeek}>Cancel</Button>
          <Button onClick={handleConfirmEndWeek}>Confirm</Button>
        </Paper>
      )}
    </Box>
  );
}

export default ChoreApplication;
