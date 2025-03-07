import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Hotel Booking
        </Typography>
        <Button color="inherit" component={Link} to="/">
          HOTELS
        </Button>
        {token ? (
          <>
            <Button color="inherit" component={Link} to="/my-bookings">
              MY BOOKINGS
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              LOGOUT
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              LOGIN
            </Button>
            <Button color="inherit" component={Link} to="/register">
              REGISTER
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;