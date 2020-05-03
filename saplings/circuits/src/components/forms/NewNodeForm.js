/**
 * Copyright 2018-2020 Cargill Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect, useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToasts } from 'react-toast-notifications';
import { postNodeRegistry } from '../../api/splinter';
import { Node } from '../../data/nodeRegistry';

import './NewNodeForm.scss';

const PlusButton = ({ actionFn, display }) => {
  if (!display) {
    return '';
  }

  const plusSign = (
    <span className="sign plus">
      <FontAwesomeIcon icon="plus-circle" />
    </span>
  );

  return (
    <button type="button" className="plus-button" onClick={actionFn}>
      {plusSign}
    </button>
  );
};

const MinusButton = ({ actionFn, display }) => {
  if (!display) {
    return '';
  }
  const minusSign = (
    <span className="sign minus">
      <FontAwesomeIcon icon="minus-circle" />
    </span>
  );

  return (
    <button className="minus-button" type="button" onClick={actionFn}>
      {minusSign}
    </button>
  );
};

const endpointsReducer = (state, action) => {
  switch (action.type) {
    case 'add-field': {
      state.endpoints.push('');
      return { ...state };
    }
    case 'remove-field': {
      const { index } = action;
      const newState = state;
      newState.endpoints.splice(index, 1);
      delete newState.errors[index];
      return { ...newState };
    }
    case 'set-field-value': {
      const { input, index } = action;
      const newState = state;
      newState.endpoints[index] = input;
      const regex = /^(([^:/?#]+):\/\/)/; // url starts with protocol

      if (
        newState.endpoints.filter(endpoint => endpoint.length !== 0).length ===
        0
      ) {
        newState.isEmpty = true;
        const error = 'At least one endpoint must be provided';
        newState.errors[0] = error;
      } else if (input.length !== 0 && !regex.test(input)) {
        const error = 'Invalid endpoint';
        newState.errors[index] = error;
      } else {
        if (newState.isEmpty) {
          delete newState.errors[0];
        }
        newState.isEmpty = false;
        delete newState.errors[index];
      }
      return { ...newState };
    }
    case 'clear': {
      return {
        endpoints: [''],
        errors: {},
        isEmpty: true
      };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

const keysReducer = (state, action) => {
  switch (action.type) {
    case 'add-field': {
      state.keys.push('');
      return { ...state };
    }
    case 'remove-field': {
      const { index } = action;
      const newState = state;
      newState.keys.splice(index, 1);
      delete newState.errors[index];
      return { ...newState };
    }
    case 'set-field-value': {
      const { input, index } = action;
      const newState = state;
      newState.keys[index] = input;

      if (
        newState.keys.filter(endpoint => endpoint.length !== 0).length === 0
      ) {
        newState.isEmpty = true;
        const error = 'At least one key must be provided';
        newState.errors[0] = error;
      } else {
        if (newState.isEmpty) {
          delete newState.errors[0];
        }
        newState.isEmpty = false;
        delete newState.errors[index];
      }
      return { ...newState };
    }
    case 'clear': {
      return {
        keys: [''],
        errors: {},
        isEmpty: true
      };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

const metadataReducer = (state, action) => {
  switch (action.type) {
    case 'add-field': {
      state.metadata.push({
        key: '',
        value: ''
      });
      return { ...state };
    }
    case 'remove-field': {
      const { index } = action;
      state.metadata.splice(index, 1);
      return { ...state };
    }
    case 'set-field-key': {
      const newState = state;
      const { key, index } = action;
      newState.metadata[index].key = key;
      return { ...newState };
    }
    case 'set-field-value': {
      const newState = state;
      const { value, index } = action;
      newState.metadata[index].value = value;
      return { ...newState };
    }
    case 'clear': {
      return {
        metadata: [
          {
            key: '',
            value: ''
          }
        ]
      };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

export function NewNodeForm({ closeFn, successCallback }) {
  const { addToast } = useToasts();
  const [formComplete, setFormComplete] = useState(false);

  const [endpointState, setEndpoints] = useReducer(endpointsReducer, {
    endpoints: [''],
    errors: {},
    isEmpty: true
  });
  const [keysState, setKeys] = useReducer(keysReducer, {
    keys: [''],
    errors: {},
    isEmpty: true
  });
  const [metadataState, setMetadata] = useReducer(metadataReducer, {
    metadata: [
      {
        key: '',
        value: ''
      }
    ]
  });

  const [displayName, setDisplayName] = useState('');
  const [nodeID, setNodeID] = useState('');

  useEffect(() => {
    const endpointsIsValid =
      Object.keys(endpointState.errors).length === 0 && !endpointState.isEmpty;

    const keysIsValid =
      Object.keys(keysState.errors).length === 0 && !keysState.isEmpty;

    if (endpointsIsValid && keysIsValid) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [endpointState, keysState]);

  const endpointField = () => {
    return endpointState.endpoints.map((endpoint, i) => {
      const currentValue = endpoint;

      return (
        <div className="input-wrapper">
          <input
            type="text"
            name="endpoint"
            value={currentValue}
            onChange={e => {
              const input = e.target.value;
              setEndpoints({
                type: 'set-field-value',
                input,
                index: i
              });
            }}
          />
          <PlusButton
            actionFn={() => {
              setEndpoints({
                type: 'add-field'
              });
            }}
            display={i === endpointState.endpoints.length - 1}
          />
          <MinusButton
            actionFn={() => {
              setEndpoints({
                type: 'remove-field',
                index: i
              });
            }}
            display={i > 0}
          />
          <div className="form-error">{endpointState.errors[i]}</div>
        </div>
      );
    });
  };

  const keysField = () => {
    return keysState.keys.map((key, i) => {
      const currentValue = key;

      return (
        <div className="input-wrapper">
          <input
            type="text"
            name="endpoint"
            value={currentValue}
            onChange={e => {
              const input = e.target.value;
              setKeys({
                type: 'set-field-value',
                input,
                index: i
              });
            }}
          />
          <PlusButton
            actionFn={() => {
              setKeys({
                type: 'add-field'
              });
            }}
            display={i === keysState.keys.length - 1}
          />
          <MinusButton
            actionFn={() => {
              setKeys({
                type: 'remove-field',
                index: i
              });
            }}
            display={i > 0}
          />
          <div className="form-error">{keysState.errors[i]}</div>
        </div>
      );
    });
  };

  const metadataField = () => {
    return metadataState.metadata.map((metada, i) => {
      const { key, value } = metada;

      return (
        <div className="input-wrapper">
          <input
            type="text"
            name="key"
            value={key}
            placeholder="Key"
            onChange={e => {
              const input = e.target.value;
              setMetadata({
                type: 'set-field-key',
                key: input,
                index: i
              });
            }}
          />
          <input
            type="text"
            name="value"
            value={value}
            placeholder="Value"
            onChange={e => {
              const input = e.target.value;
              setMetadata({
                type: 'set-field-value',
                value: input,
                index: i
              });
            }}
          />
          <PlusButton
            actionFn={() => {
              setMetadata({
                type: 'add-field'
              });
            }}
            display={i === metadataState.metadata.length - 1}
          />
          <MinusButton
            actionFn={() => {
              setMetadata({
                type: 'remove-field',
                index: i
              });
            }}
            display={i > 0}
          />
        </div>
      );
    });
  };

  const clearState = () => {
    setDisplayName('');
    setNodeID('');
    setMetadata({ type: 'clear' });
    setEndpoints({ type: 'clear' });
    setKeys({ type: 'clear' });
  };

  const submitNode = async () => {
    const metadata = {};
    metadataState.metadata.forEach(item => {
      if (item.key.length !== 0) {
        metadata[item.key] = item.value;
      }
    });
    const node = {
      identity: nodeID,
      endpoints: endpointState.endpoints.filter(endpoint => endpoint !== ''),
      display_name: displayName,
      keys: keysState.keys.filter(key => key !== ''),
      metadata
    };
    try {
      await postNodeRegistry(node);
      clearState();
      closeFn();
      successCallback(new Node(node));
      addToast('Node submitted successfully', { appearance: 'success' });
    } catch (e) {
      addToast(`${e}`, { appearance: 'error' });
    }
  };

  return (
    <div className="new-node-form-wrapper">
      <div className="title">New Node</div>
      <form className="new-node-form">
        <div className="input-wrapper">
          <div className="label">Node ID</div>
          <input
            type="text"
            value={nodeID}
            onChange={e => setNodeID(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper">
          <div className="label">Display Name</div>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <div className="label">Endpoints</div>
          {endpointField()}
        </div>
        <div>
          <div className="label">Allowed public keys</div>
          {keysField()}
        </div>
        <div className="span-col-2">
          <div className="label">Metadata</div>
          {metadataField()}
        </div>
      </form>
      <div className="form-btn-wrapper">
        <button
          type="button"
          className="form-btn cancel"
          onClick={() => {
            clearState();
            closeFn();
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!formComplete}
          className="form-btn submit"
          onClick={submitNode}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
