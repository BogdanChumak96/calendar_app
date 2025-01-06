import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { WbSunny, Nightlight } from "@mui/icons-material";
import { useLogout } from "@/hooks";
import { useThemeMode } from "@/providers";

export const Navigation = () => {
  const { mutate } = useLogout();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const handleLogout = () => {
    mutate();
    navigate("/login");
  };

  return (
    <nav className='flex justify-between items-center max-w-7.5xl mx-auto p-4 transition-colors duration-300'>
      <div className='fixed inset-0 bg-primary transition-colors duration-300 -z-10'></div>

      <div className='text-2xl font-bold text-primary-foreground'>
        CalendarApp
      </div>

      <div className='space-x-4 flex items-center'>
        <Link to='/' className='text-primary-foreground font-medium'>
          Home
        </Link>
        <IconButton
          onClick={toggleTheme}
          className='text-primary-foreground hover:text-secondary-foreground'
        >
          {mode === "light" ? (
            <Nightlight className='text-primary-foreground' />
          ) : (
            <WbSunny className='text-primary-foreground' />
          )}
        </IconButton>
        <Button
          variant='contained'
          onClick={handleLogout}
          className='bg-secondary text-secondary-foreground font-bold hover:bg-secondary-foreground'
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};
