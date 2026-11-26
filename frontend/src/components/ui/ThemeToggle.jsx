import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { Moon, Sun } from "lucide-react";

/**
 * Light / dark switch. Follows the OS setting until the user picks one;
 * MUI persists the choice in localStorage.
 */
export function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  if (!mode) return null; // not hydrated yet

  const resolved = mode === "system" ? systemMode : mode;
  const isDark = resolved === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={() => setMode(isDark ? "light" : "dark")} aria-label="toggle theme">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
    </Tooltip>
  );
}
