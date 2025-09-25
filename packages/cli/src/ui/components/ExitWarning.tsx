/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
interface ExitWarningProps {
  uiState: {
    dialogsVisible: boolean;
    ctrlCPressedOnce: boolean;
    ctrlDPressedOnce: boolean;
  };
}

export const ExitWarning: React.FC<ExitWarningProps> = ({ uiState }) => {
  if (!uiState.dialogsVisible) {
    return null;
  }

  if (uiState.ctrlCPressedOnce) {
    return (
      <Box marginTop={1}>
        <Text color={theme.status.warning}>Press Ctrl+C again to exit.</Text>
      </Box>
    );
  }

  if (uiState.ctrlDPressedOnce) {
    return (
      <Box marginTop={1}>
        <Text color={theme.status.warning}>Press Ctrl+D again to exit.</Text>
      </Box>
    );
  }

  return null;
};
