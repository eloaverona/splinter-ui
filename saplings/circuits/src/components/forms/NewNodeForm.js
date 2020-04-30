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
  const [endpoints, setEndpoints] = useState({
    endpoints: [],
    count: 1
  });

  const endpointField = () => {
    const fields = [];
    for (let i = 0; i < endpoints.count; i += 1) {
      fields.push(<input type="text" name="endpoint" />);
    }
    return fields;
  };

  return (
    <div className="new-node-form-wrapper">
      <h5>New Node</h5>
      <form>
        <input type="text" placeholder="Node ID" />
        <input type="text" placeholder="Display Name" />
        {}
        <label htmlFor="endpoint">Endpoints</label>
        {endpointField()}
        <PlusButton
          actionFn={() => {
            setEndpoints(state => ({ ...endpoints, count: state.count + 1 }));
          }}
        />
        <MinusButton
          actionFn={() => {
            setEndpoints(state => ({ ...endpoints, count: state.count - 1 }));
          }}
          display={endpoints.count > 1}
        />
      </form>
    </div>
  );
}
