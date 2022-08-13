import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Stack } from 'react-bootstrap';
import { ActiveTabStorageService } from '../../services/active-tab-storage.service';
import { ExtensionStorageService } from '../../services/extension-storage.service';
import { KeyValueMap } from '../../types';
import { IConfig } from '../../types';
import './popup-view.scss';

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

  const useCurrent = useCallback(async () => {
    if (!config) return;
    const fieldsToSync = config.syncLocalStorageKeys || [];
    await activeTabStorageService.getValues(fieldsToSync, (result => {
      extensionStorageService.setValues({
        syncValues: result
      });
    }));
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      console.error('current tab not found');
      return;
    }
    chrome.tabs.create({
      active: true,
      index: tab.index + 1,
      url: config.localEnvironmentUrl
    });
  }, [config]);

  const clearValues = useCallback(async () => {
    let { syncValues } = await extensionStorageService.getValues(['syncValues']);
    const keys = Object.keys(syncValues as KeyValueMap<string>);
    await activeTabStorageService.clearValues(keys);
  }, []);

  const clearSSOBrowsingData = async () => {
    if (!config?.ssoDomain) return;
  }

  const openOptions = useCallback(() => {
    chrome.runtime.openOptionsPage();
  }, []);

  return (
    <div className="popup-component">
      <Card>
        <Card.Header>Select Action</Card.Header>
        <Card.Body>
          <Stack gap={ 3 }>
            <Button variant="outline-primary" onClick={ useCurrent }>Use current page values</Button>
            <Button variant="outline-primary" onClick={ clearValues }>Clear values</Button>
            <Button variant="outline-primary" onClick={ clearSSOBrowsingData }>Clear SSO browsing data</Button>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <div className='footer-container'>
            <Button size="sm" variant="link" onClick={ openOptions }><i className="bi bi-gear"></i>&nbsp;Settings</Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};
