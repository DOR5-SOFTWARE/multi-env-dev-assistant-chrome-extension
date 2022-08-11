import Button from '@mui/material/Button/Button';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import Typography from '@mui/material/Typography/Typography';
import React, { useEffect, useState } from "react";
import { ExtensionStorageService } from '../../services/extension-storage.service';
import { IConfig } from '../../types';
import styles from './options-view.module.scss';

export const OptionsView = () => {
  const extensionStorageService = ExtensionStorageService.getService();
  const [stateConfig, setStateConfig] = useState<IConfig>({ localEnvironmentUrl: '', syncLocalStorageKeys: [''] });

  useEffect(() => {
    extensionStorageService.getValues(['config']).then(result => {
      const configFromStorage = result.config as IConfig;
      if (!configFromStorage.localEnvironmentUrl && !configFromStorage.syncLocalStorageKeys?.length) return;
      if (!configFromStorage.syncLocalStorageKeys?.length) {
        configFromStorage.syncLocalStorageKeys = ['example'];
      }
      setStateConfig(configFromStorage);
    })
  }, []);

  const addSyncField = () => {
    const updatedConfig = { ...stateConfig };
    updatedConfig.syncLocalStorageKeys!.push('');
    setStateConfig(updatedConfig);
  }

  const handleInputTextChange = ((event: any) => {
    const name: string = event.target.name;
    const value: string = event.target.value;
    const updatedStateConfig = { ...stateConfig };
    if (name === 'local-environment-url') {
      updatedStateConfig.localEnvironmentUrl = value;
    }
    if (name.startsWith('sync-field-')) {
      const index = +(name.slice(-1))
      updatedStateConfig.syncLocalStorageKeys![index] = value;
    }
    const filteredLocalStorageKeys = updatedStateConfig.syncLocalStorageKeys!.filter(key => !!key);
    if (!filteredLocalStorageKeys.length) {
      filteredLocalStorageKeys.push('');
    }
    updatedStateConfig.syncLocalStorageKeys = filteredLocalStorageKeys;
    setStateConfig(updatedStateConfig);
  })

  const saveSettings = async (event: any) => {
    event.preventDefault();
    await extensionStorageService.setValues({ config: stateConfig });
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      return;
    }
    chrome.tabs.remove(tab.id);
  }

  return (
    <div className={ styles['component'] }>
      <form onSubmit={ saveSettings }>
        <div className={ styles['options-section'] }>
          <Typography variant="subtitle2">Local environment url:</Typography>
          <TextField variant="outlined" size="small" value={ stateConfig.localEnvironmentUrl } onChange={ handleInputTextChange } name="local-environment-url" />
        </div>
        <div className={ styles['options-section'] }>
          <Typography variant="subtitle2">Sync the following fields:</Typography>
          <Stack spacing={ 1 }>
            { stateConfig.syncLocalStorageKeys?.map((fieldName, index) => (
              <TextField variant="outlined" size="small" value={ fieldName } onChange={ handleInputTextChange } key={ `sync-field-${index}` } name={ `sync-field-${index}` } />
            )) }
            <Button size="small" variant="text" onClick={ addSyncField }>Add Field</Button>
          </Stack>
        </div>
        <div className={ styles['options-section'] }>
          <Button variant="contained" type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};
