import React, { useEffect, useState } from "react";
import { Button, Card, Form, Stack } from 'react-bootstrap';
import { ExtensionStorageService } from '../../services/extension-storage.service';
import { IConfig } from '../../types';
import './options-view.scss';

export const OptionsView = () => {
  const extensionStorageService = ExtensionStorageService.getService();
  const [stateConfig, setStateConfig] = useState<IConfig>({ localEnvironmentUrl: '', publicEnvironmentUrl: '', syncLocalStorageKeys: [' '], ssoDomain: '' });

  useEffect(() => {
    extensionStorageService.getValues(['config']).then(result => {
      const configFromStorage = result.config as IConfig;
      if (!configFromStorage.localEnvironmentUrl && !configFromStorage.syncLocalStorageKeys?.length) return;
      if (!configFromStorage.syncLocalStorageKeys?.length) {
        configFromStorage.syncLocalStorageKeys = [' '];
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
    if (name === 'public-environment-url') {
      updatedStateConfig.publicEnvironmentUrl = value;
    }
    if (name === 'sso-domain') {
      updatedStateConfig.ssoDomain = value;
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
    await chrome.scripting.unregisterContentScripts();
    if (stateConfig.localEnvironmentUrl) {
      try {
        await chrome.scripting.registerContentScripts([{
          id: 'local_dev_onstart',
          matches: [`${stateConfig.localEnvironmentUrl}/*`],
          runAt: 'document_start',
          js: ['js/local_dev.js']
        }]);
      } catch (error) {
        console.error(error);
      }
    }
    await extensionStorageService.setValues({ config: stateConfig });
    await chrome.action.setPopup({
      popup: '../views/popup.html'
    });
    chrome.extension.getViews().forEach(v => v.close());
  }

  return (
    <div className="options-component">
      <Card>
        <Card.Header>Configuration</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="options-section">
              <Form.Label>Local environment root url:</Form.Label>
              <Form.Control
                value={ stateConfig.localEnvironmentUrl }
                onChange={ handleInputTextChange }
                name="local-environment-url"
                aria-describedby="local-env-url-help" />
              <Form.Text id="local-env-url-help" muted>
                Fully qualified local env root url.
              </Form.Text>
            </Form.Group>
            <Form.Group className="options-section">
              <Form.Label>Public environment root url:</Form.Label>
              <Form.Control
                value={ stateConfig.publicEnvironmentUrl }
                onChange={ handleInputTextChange }
                name="public-environment-url"
                aria-describedby="public-env-url-help" />
              <Form.Text id="public-env-url-help" muted>
                Fully qualified public env root url.
              </Form.Text>
            </Form.Group>
            <Form.Group className="options-section">
              <Form.Label>Sync the following fields:</Form.Label>
              <Stack gap={ 2 }>
                { stateConfig.syncLocalStorageKeys?.map((fieldName, index) => (
                  <Form.Control value={ fieldName } onChange={ handleInputTextChange } key={ `sync-field-${index}` } name={ `sync-field-${index}` } />
                )) }
                <Button variant="outline-primary" size="sm" onClick={ addSyncField }>Add Field</Button>
              </Stack>
            </Form.Group>
            <Form.Group className="options-section">
              <Form.Label>SSO domain</Form.Label>
              <Form.Control value={ stateConfig.ssoDomain } onChange={ handleInputTextChange } name="sso-domain" />
            </Form.Group>
            <Form.Group className="options-section">
              <Button type="submit" onClick={ saveSettings }>Save</Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
