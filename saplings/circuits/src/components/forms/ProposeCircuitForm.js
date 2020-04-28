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
import { MultiStepForm, Step, StepInput } from './MultiStepForm';
import { useNodeRegistryState } from '../../state/nodeRegistry';
import { useLocalNodeState } from '../../state/localNode';

import nodeIcon from '../../images/node_icon.svg';
import NodeCard from '../NodeCard';
import './forms.scss';

export function ProposeCircuitForm() {
  const nodes = useNodeRegistryState();
  const localNodeID = useLocalNodeState();
  const [localNode] = nodes.filter(node => node.identity === localNodeID);
  console.log("localNode");

  console.log(localNode);
  return (
    <MultiStepForm
      formName="Propose Circuit"
      handleSubmit={() => {}}
      disabled="false"
    >
      <Step step={1} label="Add Nodes">
        <div className="node-registry-wrapper">
          <div className="selected-nodes">
            <NodeCard node={localNode} isLocal />
            <input
              type="text"
              placeholder="Find nodes"
              className="search-nodes-input"
            />
          </div>
          <div className="available-nodes">
            <ul>
              {nodes.map(node => (
                <li className="node-item">
                  <img
                    src={nodeIcon}
                    className="node-icon"
                    alt="Icon for a node"
                  />
                  <span className="node-name">{node.displayName}</span>
                  <span className="node-id">{node.identity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Step>
      <Step step={2} label="Test input 2">
        <StepInput type="file" accept="text/csv" id="add-master-data-file" />
      </Step>
      <Step step={3} label="Test input 3">
        <StepInput type="file" accept="text/csv" id="add-master-data-file" />
      </Step>
    </MultiStepForm>
  );
}

export default ProposeCircuitForm;
