import React, { useState } from "react";
import LoginPage from "./LoginPage";
import MainMenu from "./MainMenu";
import ChoreApplication from "./ChoreApplication";
import TotalsPage from "./TotalsPage";
import NavigationMenu from "./NavigationMenu";

function App() {
  const [userType, setUserType] = useState(null); // Manage user type (admin or viewer)
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem("profiles");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeProfile, setActiveProfile] = useState(null); // Current active profile
  const [activePage, setActivePage] = useState("main"); // "main", "tracker", or "totals"
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu anchor

  const updateProfiles = (updatedList) => {
    setProfiles(updatedList);
    localStorage.setItem("profiles", JSON.stringify(updatedList));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (option) => {
    setAnchorEl(null);
    if (option === "logout") {
      // Reset everything on logout
      setUserType(null);
      setActiveProfile(null);
      setActivePage("main");
    } else if (option === "viewTotals") {
      setActivePage("totals");
    } else if (option === "backToMenu") {
      setActivePage("main");
    } else if (option === "backToTracker") {
      setActivePage("tracker");
    } else if (option === "rules") {
      window.open(
        "https://drive.google.com/file/d/1vA4VAybJodR1r-OwM2ZSPbGJoKWTLKlU/view?usp=drive_link",
        "_blank"
      );
    }
  };

  const getMenuOptions = () => {
    if (activePage === "main") {
      return [
        { label: "Rules", action: "rules" },
        { label: "Logout", action: "logout" },
      ];
    } else if (activePage === "tracker") {
      return [
        { label: "Back to Main Menu", action: "backToMenu" },
        { label: "Logout", action: "logout" },
        { label: "View Totals", action: "viewTotals" },
      ];
    } else if (activePage === "totals") {
      return [
        { label: "Back to Tracker", action: "backToTracker" },
        { label: "Main Menu", action: "backToMenu" },
        { label: "Logout", action: "logout" },
      ];
    }
    return [];
  };

  const handleProfileSelection = (profile) => {
    setActiveProfile(profile);
    setActivePage("tracker"); // Route to tracker when a profile is selected
  };

  // Ensure that viewer login lands on the main menu (no profile auto-selected)
  if (!userType) {
    return <LoginPage onLogin={setUserType} />;
  }

  return (
    <>
      {/* Navigation Menu displayed on every page */}
      <NavigationMenu
        options={getMenuOptions()}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onSelect={handleMenuSelect}
      />

      {/* Main Menu */}
      {activePage === "main" && (
        <MainMenu
          userType={userType}
          profiles={profiles}
          setProfiles={updateProfiles}
          onOpenProfile={handleProfileSelection}
          onLogout={() => {
            setUserType(null);
            setActiveProfile(null);
            setActivePage("main");
          }}
          onViewTotals={(profile) => {
            if (profile.weeklyTotal > 0 || userType === "admin") {
              setActiveProfile(profile);
              setActivePage("totals");
            }
          }}
        />
      )}

      {/* Chore Application (Tracker) */}
      {activePage === "tracker" && (
        <ChoreApplication
          profile={activeProfile}
          onBackToMenu={() => setActivePage("main")}
          profiles={profiles}
          setProfiles={updateProfiles}
          userType={userType}
          onLogout={() => {
            setUserType(null);
            setActiveProfile(null);
            setActivePage("main");
          }}
          onViewTotals={() => setActivePage("totals")}
        />
      )}

      {/* Totals Page */}
      {activePage === "totals" && (
        <TotalsPage
          profile={activeProfile}
          onBackToMenu={() => setActivePage("main")}
          onBackToTracker={() => setActivePage("tracker")}
          onLogout={() => {
            setUserType(null);
            setActiveProfile(null);
            setActivePage("main");
          }}
        />
      )}
    </>
  );
}

export default App;
