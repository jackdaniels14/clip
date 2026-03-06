import React from 'react';
import { Box, Typography } from '@mui/material';

const SessionMonitor: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Session Monitor
      </Typography>
      <Typography color="textSecondary">
        Real-time session monitoring will be displayed here
      </Typography>
    </Box>
  );
};

export default SessionMonitor;
