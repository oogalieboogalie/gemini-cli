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

export const ExitWarning: React.FC<ExitWarningProps> = ({ uiState }) => (
  <>
    {uiState.dialogsVisible && uiState.ctrlCPressedOnce && (
      <Box marginTop={1}>
        <Text color={theme.status.warning}>Press Ctrl+C again to exit.</Text>
      </Box>
    )}

    {uiState.dialogsVisible && uiState.ctrlDPressedOnce && (
      <Box marginTop={1}>
        <Text color={theme.status.warning}>Press Ctrl+D again to exit.</Text>
      </Box>
    )}
  </>
);
