import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import type { FunctionComponent } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

/**
 * Breadcrumbs component to display the navigation path on each page.
 */
const Breadcrumbs: FunctionComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Box sx={{ padding: '16px 24px', display: { xs: 'none', md: 'block' } }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link
          component={RouterLink}
          to="/"
          underline="hover"
          color="inherit"
          sx={{ fontWeight: pathnames.length === 0 ? 600 : 400 }}
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography key={to} color="text.primary" sx={{ fontWeight: 600 }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link key={to} component={RouterLink} to={to} underline="hover" color="inherit">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
