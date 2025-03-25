import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

function MainMenu({ onOpenProfile, onLogout, onViewTotals, userType }) {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem("profiles");
    return saved ? JSON.parse(saved) : [];
  });
  const [newProfileName, setNewProfileName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [showNoDataPopup, setShowNoDataPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      setProfiles([
        ...profiles,
        { name: newProfileName.trim(), weeklyTotal: 0 },
      ]);
      setNewProfileName("");
      setOpenDialog(false);
    }
  };

  const handleOpenMenu = (event, index) => {
    event.stopPropagation(); // Prevent click from triggering parent
    setSelectedIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const handleDeleteProfile = () => {
    if (selectedIndex !== null) {
      if (window.confirm("Are you sure you want to delete this profile?")) {
        const updatedProfiles = [...profiles];
        updatedProfiles.splice(selectedIndex, 1);
        setProfiles(updatedProfiles);
      }
      handleCloseMenu();
    }
  };

  const handleEditProfile = () => {
    const currentProfile = profiles[selectedIndex];
    const newName = prompt("Enter new profile name:", currentProfile?.name);
    if (newName && newName.trim()) {
      const updatedProfiles = [...profiles];
      updatedProfiles[selectedIndex] = {
        ...updatedProfiles[selectedIndex],
        name: newName.trim(),
      };
      setProfiles(updatedProfiles);
    }
    handleCloseMenu();
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewTotals = (profile) => {
    if (profile.weeklyTotal > 0) {
      onViewTotals(profile);
    } else {
      setShowNoDataPopup(true);
    }
    handleCloseMenu();
  };

  return (
    <Container
      maxWidth="md"
      style={{
        marginTop: "2rem",
        backgroundColor: "#e3f2fd",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      <AppBar position="static" style={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
            Wolfe Family Rewards Tracking
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1vA4VAybJodR1r-OwM2ZSPbGJoKWTLKlU/view?usp=drive_link",
                  "_blank"
                )
              }
            >
              Rules
            </MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Show 'Create Profile' button only for admins */}
      {userType === "admin" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create Profile
          </Button>
        </div>
      )}

      <List style={{ marginTop: "2rem" }}>
        {(profiles || []).map((profile, index) => (
          <ListItem key={index}>
            <Avatar style={{ marginRight: "1rem" }}>
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={profile.name}
              onClick={() => onOpenProfile(profile)}
              style={{ cursor: "pointer" }}
            />
            <IconButton
              edge="end"
              onClick={(event) => handleOpenMenu(event, index)}
              disabled={userType === "viewer"} // Disable menu for viewer
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {/* Show Edit/Delete menu items only for admins */}
        {userType === "admin" && (
          <>
            <MenuItem onClick={handleEditProfile}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteProfile}>Delete</MenuItem>
          </>
        )}
        {selectedIndex !== null && (
          <MenuItem onClick={() => handleViewTotals(profiles[selectedIndex])}>
            View Totals
          </MenuItem>
        )}
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Profile Name"
            fullWidth
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProfile}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {showNoDataPopup && (
        <Paper
          elevation={3}
          style={{
            position: "fixed",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            zIndex: 9999,
            backgroundColor: "#fff",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={() => setShowNoDataPopup(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body1">No Data Available</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default MainMenu;
