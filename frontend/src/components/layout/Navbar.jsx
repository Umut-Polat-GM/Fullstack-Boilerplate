import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Boxes, House, LogIn, LogOut, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { navItems } from "@/app/features";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { notify } from "@/lib/notify";
import { useAuthStore } from "@/store/useAuthStore";

const APP_NAME = import.meta.env.VITE_APP_NAME || "Fullstack Boilerplate";
const links = [{ label: "Home", path: "/", icon: House, end: true }, ...navItems];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
  }`;

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMenuAnchor(null);
    logout();
    notify.info("Signed out");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      className="glass border-b border-slate-200 dark:border-white/10"
    >
      <Toolbar className="mx-auto w-full max-w-6xl gap-2">
        <IconButton className="md:hidden" onClick={() => setDrawerOpen(true)} aria-label="menu">
          <MenuIcon size={20} />
        </IconButton>

        <Link to="/" className="mr-4 flex items-center gap-2 font-bold">
          <Boxes className="text-brand-600 dark:text-brand-500" size={24} />
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {links.map(({ label, path, end }) => (
            <NavLink key={path} to={path} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <>
              <Tooltip title={user.email}>
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} className="gap-2">
                  <LogOut size={16} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              startIcon={<LogIn size={16} />}
            >
              Login
            </Button>
          )}
        </div>
      </Toolbar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List className="w-64 pt-4">
          {links.map(({ label, path, icon: Icon, end }) => (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              end={end}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{Icon && <Icon size={18} />}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
