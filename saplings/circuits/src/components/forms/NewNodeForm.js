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

const PlusButton = ({ actionFn }) => {
  const plusSign = (
    <span className="sign plus">
      <FontAwesomeIcon icon="plus-circle" />
    </span>
  );

  return (
    <button type="button" onClick={actionFn}>
      {plusSign}
    </button>
  );
};

const MinusButton = ({ actionFn, display }) => {
  if (!display) {
    return ''
  }
  const minusSign = (
    <span className="sign minus">
      <FontAwesomeIcon icon="minus-circle" />
    </span>
  );

  return (
    <button type="button" onClick={actionFn}>
      {minusSign}
    </button>
  );
};

export function NewNodeForm() {
  const [endpointState, setEndpoints] = useState({
    endpoints: [],
    count: 1
  });

  const [displayName, setDisplayName] = useState('');
  const [nodeID, setNodeID] = useState('');

  const endpointField = () => {
    const fields = [];
    for (let i = 0; i < endpointState.count; i += 1) {
      fields.push(
        <input
          type="text"
          name="endpoint"
          onKeyUp={e => {
            const input = e.target.value;
            setEndpoints(state => {
              state.endpoints[i] = input;
              return { ...state };
            });
          }}
        />
      );
    }
    return fields;
  };

  const submitNode = async () => {
    const node = {
      identity: nodeID,
      endpoints: endpointState.endpoints,
      display_name: displayName,
      keys: [],
      metadata: {
        organization: 'dasda'
      }
    };
    try {
      await postNodeRegistry(node);
    } catch (e) {
      throw Error(`Error fetching posting node: ${e}`);
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
        <label htmlFor="endpoint">Endpoints</label>
        {endpointField()}
        <PlusButton
          actionFn={() => {
            setEndpoints(state => ({
              ...endpointState,
              count: state.count + 1
            }));
          }}
        />
        <MinusButton
          actionFn={() => {
            setEndpoints(state => ({
              ...endpointState,
              count: state.count - 1
            }));
          }}
          display={endpointState.count > 1}
        />
        <button type="button">Cancel</button>
        <button type="button" onClick={submitNode}>
          Submit
        </button>
      </form>
    </div>
  );
}
