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

import React, { useState, useEffect } from 'react';
import { MultiStepForm, Step, StepInput } from './MultiStepForm';
import { useNodeRegistryState } from '../../state/nodeRegistry';
import { useLocalNodeState } from '../../state/localNode';
import mockNodes from '../../mockData/nodes';

import nodeIcon from '../../images/node_icon.svg';
import NodeCard from '../NodeCard';
import { Chip, Chips } from '../Chips';

import './ProposeCircuitForm.scss';

export function ProposeCircuitForm() {
  const nodes = useNodeRegistryState();
  const localNodeID = useLocalNodeState();
  const [localNode] = nodes.filter(node => node.identity === localNodeID);
  const [selectedNodes, setSelectedNodes] = useState({
    nodes: []
  });
  const [availableNodes, setAvailableNodes] = useState({
    nodes: []
  });

  const addNode = node => {
    setSelectedNodes(state => {
      state.nodes.push(node);
      return { ...state };
    });

    setAvailableNodes(state => {
      const filteredNodes = state.nodes.filter(
        item => item.identity !== node.identity
      );
      return { nodes: filteredNodes };
    });
  };

  const removeNode = node => {
    setSelectedNodes(state => {
      const filteredNodes = state.nodes.filter(
        item => item.identity !== node.identity
      );
      return { nodes: filteredNodes };
    });

    setAvailableNodes(state => {
      state.nodes.push(node);
      return { ...state };
    });
  };

  useEffect(() => {
    if (nodes) {
      nodes.push(...mockNodes);
      setAvailableNodes(state => {
        state.nodes.push(...nodes);
        return { ...state };
      });
    }
  }, [nodes]);

  useEffect(() => {
    if (localNode) {
      addNode(localNode);
    }
  }, [localNode]);

  return (
    <MultiStepForm
      formName="Propose Circuit"
      handleSubmit={() => {}}
      disabled="false"
    >
      <Step step={1} label="Add Nodes">
        <div className="node-registry-wrapper">
          <div className="selected-nodes">
            <Chips>
              {selectedNodes.nodes.map(node => {
                const local = node.identity === localNodeID;
                return (
                  <Chip
                    node={node}
                    isLocal={local}
                    deleteable={!local}
                    removeFn={() => removeNode(node)}
                  />
                );
              })}
              <input
                type="text"
                placeholder="Find nodes"
                className="search-nodes-input"
              />
            </Chips>
          </div>
          <div className="available-nodes">
            <ul>
              {availableNodes.nodes.map(node => (
                <li className="node-item">
                  <button type="button" onClick={() => addNode(node)}>
                    <img
                      src={nodeIcon}
                      className="node-icon"
                      alt="Icon for a node"
                    />
                    <span className="node-name">{node.displayName}</span>
                    <span className="node-id">{node.identity}</span>
                  </button>
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
