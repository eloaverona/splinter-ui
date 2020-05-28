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

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './NodeCard.scss';

const NodeCard = ({ node, dispatcher, isLocal, selected }) => {
  return (
    <div className="node-card">
      <div className="node-description">
        <div className="field-wrapper">
          <div className="field-header">Name</div>
          <div className="field-value">{node.displayName}</div>
        </div>
        <div className="field-wrapper">
          <div className="field-header">ID</div>
          <div className="field-value">{node.identity}</div>
        </div>
        <div className="field-wrapper">
          <div className="field-header">Endpoints</div>
          {node.endpoints.map(endpoint => {
            return <div className="field-value">{endpoint}</div>;
          })}
        </div>
        <div className="node-labels">
          <div className={isLocal ? 'node-local' : 'hide'}>Local</div>
          <button
            type="button"
            className="select-box"
            onClick={() => dispatcher(node)}
            disabled={isLocal}
          >
            {selected && <FontAwesomeIcon icon="check" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeCard;
