import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { WbSunny, Nightlight } from "@mui/icons-material";
import { useLogout } from "@/hooks";
import { useThemeStore } from "@/store/themeStore";

export const Navigation = () => {
  const { mutate } = useLogout();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    mutate();
    navigate("/login");
  };

  return (
    <nav className='flex justify-between items-center px-4 py-2 max-w-7.5xl mx-auto bg-transparent transition-colors duration-300'>
      <div className='fixed inset-0 bg-primary transition-colors duration-300 -z-10'></div>

      <div className='text-2xl font-bold text-primary-foreground'>
        CalendarApp
      </div>

      <div className='flex items-center space-x-6'>
        <Link
          to='/'
          className='text-primary-foreground font-medium hover:text-secondary-foreground transition-colors duration-300'
        >
          Home
        </Link>

        <IconButton
          onClick={toggleTheme}
          className='text-primary-foreground hover:text-secondary-foreground transition-colors duration-300'
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
          className='bg-secondary text-secondary-foreground font-bold hover:bg-secondary-foreground transition-colors duration-300'
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};
