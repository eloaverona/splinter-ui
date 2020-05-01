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
import { postNodeRegistry } from '../../api/splinter';
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
      state.endpoints.splice(index, 1);
      return { ...state };
    }
    case 'set-field-value': {
      const { input, index } = action;
      const newState = state;
      console.log("input");

      console.log(input);

      newState.endpoints[index] = input;
      return { ...newState };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

export function NewNodeForm() {
  const [endpointState, setEndpoints] = useReducer(endpointsReducer, {
    endpoints: ['']
  });

  const [displayName, setDisplayName] = useState('');
  const [nodeID, setNodeID] = useState('');

  const endpointField = () => {
    return endpointState.endpoints.map((endpoint, i) => {
      const currentValue = endpoint;

      return (
        <div className="endpoint-input-wrapper">
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
        </div>
      );
    });
  };

  const submitNode = async () => {
    const node = {
      identity: nodeID,
      endpoints: endpointState.endpoints.filter(endpoint => endpoint !== ''),
      display_name: displayName,
      keys: [],
      metadata: {
        organization: 'dasda'
      }
    };
    try {
      await postNodeRegistry(node);
    } catch (e) {
      throw Error(`Error posting node: ${e}`);
    }
  };

  return (
    <div className="new-node-form-wrapper">
      <div className="title">New Node</div>
      <form className="new-node-form">
        <div className="input-group">
          <input
            type="text"
            onKeyUp={e => setNodeID(e.target.value)}
            placeholder="Node ID"
          />
          <input
            type="text"
            onKeyUp={e => setDisplayName(e.target.value)}
            placeholder="Display Name"
          />
        </div>
        <div className="endpoints-wrapper"> </div>
        <div className="label">Endpoints</div>
        {endpointField()}
        <button type="button">Cancel</button>
        <button type="button" onClick={submitNode}>
          Submit
        </button>
      </form>
    </div>
  );
}
