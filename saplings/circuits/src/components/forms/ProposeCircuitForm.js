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
import { MultiStepForm, Step, StepInput } from './MultiStepForm';
import { useNodeRegistryState } from '../../state/nodeRegistry';
import { useLocalNodeState } from '../../state/localNode';
import mockNodes from '../../mockData/nodes';

import nodeIcon from '../../images/node_icon.svg';
import NodeCard from '../NodeCard';
import { OverlayModal } from '../OverlayModal';
import { NewNodeForm } from './NewNodeForm';

import { Chip, Chips } from '../Chips';

import './ProposeCircuitForm.scss';

const filterNodes = (nodes, input) => {
  const filteredNodes = nodes.filter(node => {
    if (node.identity.toLowerCase().indexOf(input) > -1) {
      return true;
    }
    if (node.displayName.toLowerCase().indexOf(input) > -1) {
      return true;
    }
    return false;
  });

  return filteredNodes;
};

const nodesReducer = (state, action) => {
  switch (action.type) {
    case 'filter': {
      const nodes = filterNodes(state.availableNodes, action.input);
      const filteredNodes = {
        nodes,
        filteredBy: action.input
      };
      return { ...state, filteredNodes };
    }
    case 'select': {
      const { node } = action;
      state.selectedNodes.push(node);
      const availableNodes = state.availableNodes.filter(
        item => item.identity !== node.identity
      );
      const nodes = filterNodes(availableNodes, state.filteredNodes.filteredBy);
      const filteredNodes = {
        nodes,
        filteredBy: state.filteredNodes.filteredBy
      };

      return { ...state, availableNodes, filteredNodes };
    }
    case 'removeSelect': {
      const { node } = action;
      const selectedNodes = state.selectedNodes.filter(
        item => item.identity !== node.identity
      );
      state.availableNodes.push(node);
      const nodes = filterNodes(
        state.availableNodes,
        state.filteredNodes.filteredBy
      );
      const filteredNodes = {
        nodes,
        filteredBy: state.filteredNodes.filteredBy
      };
      return { ...state, selectedNodes, filteredNodes };
    }
    case 'set': {
      const { nodes } = action;
      return {
        ...state,
        nodes,
        availableNodes: nodes,
        filteredNodes: {
          nodes,
          filteredBy: ''
        }
      };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

export function ProposeCircuitForm() {
  const allNodes = useNodeRegistryState();
  const localNodeID = useLocalNodeState();
  const [modalActive, setModalActive] = useState(false);
  const [localNode] = allNodes.filter(node => node.identity === localNodeID);
  const [nodesState, setNodesState] = useReducer(nodesReducer, {
    nodes: [],
    selectedNodes: [],
    availableNodes: [],
    filteredNodes: {
      nodes: [],
      filteredBy: ''
    }
  });

  const plusSign = (
    <span className="add-sign">
      <FontAwesomeIcon icon="plus" />
    </span>
  );

  useEffect(() => {
    if (allNodes) {
      allNodes.push(...mockNodes);
      setNodesState({
        type: 'set',
        nodes: allNodes
      });
    }
  }, [allNodes]);

  useEffect(() => {
    if (localNode) {
      setNodesState({
        type: 'select',
        node: localNode
      });
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
          <div className="selected-nodes-header">
            <div className="title">Selected nodes</div>
          </div>

          <div className="selected-nodes">
            <Chips>
              {nodesState.selectedNodes.map(node => {
                const local = node.identity === localNodeID;
                return (
                  <Chip
                    node={node}
                    isLocal={local}
                    deleteable={!local}
                    removeFn={() => {
                      setNodesState({ type: 'removeSelect', node });
                    }}
                  />
                );
              })}
            </Chips>
          </div>
          <div className="available-nodes">
            <div className="available-nodes-header">
              <div className="title-wrapper">
                <div className="title">Available nodes</div>
                <input
                  type="text"
                  placeholder="Filter"
                  className="search-nodes-input"
                  onKeyUp={event => {
                    setNodesState({
                      type: 'filter',
                      input: event.target.value.toLowerCase()
                    });
                  }}
                />
              </div>
              <button
                type="button"
                className="new-node-button"
                onClick={() => setModalActive(true)}
              >
                {plusSign}
                New node
              </button>
            </div>
            <ul>
              {nodesState.filteredNodes.nodes.map(node => (
                <li className="node-item">
                  <button
                    type="button"
                    onClick={() => {
                      setNodesState({
                        type: 'select',
                        node
                      });
                    }}
                  >
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
        <OverlayModal open={modalActive} closeFn={() => setModalActive(false)}>
          <NewNodeForm />
        </OverlayModal>
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
