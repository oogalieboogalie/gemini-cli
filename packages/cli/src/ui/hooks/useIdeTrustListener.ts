/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  useRef,
} from 'react';
import {
  IdeClient,
  IDEConnectionStatus,
  ideContextStore,
  type IDEConnectionState,
} from '@google/gemini-cli-core';
import { useSettings } from '../contexts/SettingsContext.js';
import { isWorkspaceTrusted } from '../../config/trustedFolders.js';

/**
 * This hook listens for trust status updates from the IDE companion extension.
 * It provides the current trust status from the IDE and a flag indicating
 * if a restart is needed because the trust state has changed.
 *
 * It also listens for connection status changes and will return `undefined`
 * for the trust status if the IDE is disconnected.
 */
export function useIdeTrustListener() {
  const settings = useSettings();
  const [connectionStatus, setConnectionStatus] = useState<IDEConnectionStatus>(
    IDEConnectionStatus.Disconnected,
  );
  const previousTrust = useRef<boolean | undefined>(undefined);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handleStatusChange = (state: IDEConnectionState) => {
      setConnectionStatus(state.status);
      // Also notify useSyncExternalStore that the data has changed
      onStoreChange();
    };

    (async () => {
      const ideClient = await IdeClient.getInstance();
      ideClient.addTrustChangeListener(onStoreChange);
      ideClient.addStatusChangeListener(handleStatusChange);
      setConnectionStatus(ideClient.getConnectionStatus().status);
    })();
    return () => {
      (async () => {
        const ideClient = await IdeClient.getInstance();
        ideClient.removeTrustChangeListener(onStoreChange);
        ideClient.removeStatusChangeListener(handleStatusChange);
      })();
    };
  }, []);

  const getSnapshot = () => {
    if (connectionStatus !== IDEConnectionStatus.Connected) {
      return undefined;
    }
    return ideContextStore.get()?.workspaceState?.isTrusted;
  };

  const isIdeTrusted = useSyncExternalStore(subscribe, getSnapshot);
  const [needsRestart, setNeedsRestart] = useState(false);

  useEffect(() => {
    const currentTrust = isWorkspaceTrusted(settings.merged).isTrusted;
    // Trigger a restart if the overall trust status for the CLI has changed,
    // but not on the initial trust value.
    if (
      previousTrust.current !== undefined &&
      previousTrust.current !== currentTrust
    ) {
      setNeedsRestart(true);
    }
    previousTrust.current = currentTrust;
  }, [isIdeTrusted, settings.merged]);

  return { isIdeTrusted, needsRestart };
}
