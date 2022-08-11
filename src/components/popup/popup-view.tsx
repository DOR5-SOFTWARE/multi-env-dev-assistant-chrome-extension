import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import React, { useCallback, useEffect, useState } from "react";
import { ActiveTabStorageService } from '../../services/active-tab-storage.service';
import { ExtensionStorageService } from '../../services/extension-storage.service';
import { KeyValueMap } from '../../types';
import { IConfig } from '../../types';
import styles from './popup-view.module.scss';

export const PopupView = () => {
  const activeTabStorageService = ActiveTabStorageService.getService();
  const extensionStorageService = ExtensionStorageService.getService();

  const [config, setConfig] = useState<IConfig | undefined>();

  useEffect(() => {
    if (config) return;
    extensionStorageService.getValues(['config']).then(result => {
      const configFromStorage = result.config as IConfig;
      setConfig(configFromStorage);
    })
  }, []);

  const copyValues = useCallback(async () => {
    if (!config) return;
    const fieldsToSync = config.syncLocalStorageKeys || [];
    activeTabStorageService.getValues(fieldsToSync, (result => {
      extensionStorageService.setValues({
        syncValues: result
      });
    }));
  }, [config]);

  const setValues = async () => {
    const { syncValues } = await extensionStorageService.getValues(['syncValues']);
    activeTabStorageService.setValues(syncValues as KeyValueMap<string>);
  }

  const clearValues = async () => {
    let { syncValues } = await extensionStorageService.getValues(['syncValues']);
    const keys = Object.keys(syncValues as KeyValueMap<string>);
    await activeTabStorageService.clearValues(keys);
    syncValues = {};
    activeTabStorageService.setValues(syncValues as KeyValueMap<string>);
  }

  return (
    <div className={ styles['component'] }>
      <Stack spacing={ 1 }>
        <Button variant="outlined" size="small" onClick={ copyValues }>Copy Values</Button>
        <Button variant="outlined" size="small" onClick={ setValues }>Use Values</Button>
        <Button variant="outlined" size="small" onClick={ clearValues }>Clear Values</Button>
      </Stack>
    </div>
  );
};
