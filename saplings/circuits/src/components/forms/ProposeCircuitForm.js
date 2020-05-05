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
import PropTypes from 'prop-types';

import { MultiStepForm, Step } from './MultiStepForm';
import { useNodeRegistryState } from '../../state/nodeRegistry';
import { useLocalNodeState } from '../../state/localNode';
import { Node } from '../../data/nodeRegistry';
import nodeIcon from '../../images/node_icon.svg';
import { OverlayModal } from '../OverlayModal';
import { NewNodeForm } from './NewNodeForm';
import mockNodes from '../../mockData/nodes';
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
  const errorMessage =
    'At least two nodes must be part of a circuit. Please select a node.';

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

      let { error } = state;
      if (state.selectedNodes.length >= 2) {
        error = '';
      }

      return { ...state, availableNodes, filteredNodes, error };
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

      let error = '';
      if (selectedNodes.length < 2) {
        error = errorMessage;
      }
      return { ...state, selectedNodes, filteredNodes, error };
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

const allowedNodesReducer = (state, action) => {
  const errorMessage =
    'At least two nodes must be part of a circuit. Please select a node.';

  switch (action.type) {
    case 'toggle-show': {
      return { ...state, show: !state.show }
    }
    case 'toggle-select': {
      const { node } = action;
      const newState = state;
      if (state.selectedNodes[node.identity]) {
        delete newState.selectedNodes[node.identity];
      } else {
        newState.selectedNodes[node.identity] = node;
      }
      return { ...newState };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

const NodeList = ({ nodes, onClickFn }) => {
  return (
    <ul className="nodes-list">
      {nodes.map(node => (
        <li className={"node-item"}>
          <button
            type="button"
            onClick={() => {
              onClickFn(node);
            }}
          >
            <img src={nodeIcon} className="node-icon" alt="Icon for a node" />
            <span className="node-name">{node.displayName}</span>
            <span className="node-id">{node.identity}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

NodeList.propTypes = {
  nodes: PropTypes.arrayOf(Node).isRequired,
  onClickFn: PropTypes.func.isRequired,
  nodeItemClass: PropTypes.string
};

NodeList.defaultProps = {
  nodeItemClass: ''
};

export function ProposeCircuitForm() {
  const allNodes = useNodeRegistryState();
  const localNodeID = useLocalNodeState();
  const [modalActive, setModalActive] = useState(false);
  const [localNode] = allNodes.filter(node => node.identity === localNodeID);
  const [nodesState, nodesDispatcher] = useReducer(nodesReducer, {
    selectedNodes: [],
    availableNodes: [],
    filteredNodes: {
      nodes: [],
      filteredBy: ''
    },
    error: ''
  });

  const [allowedNodes, allowedNodesDispatch] = useReducer(allowedNodesReducer, {
    show: false,
    selectedNodes: {}
  });

  const nodesAreValid = () => {
    return nodesState.selectedNodes.length >= 2;
  };

  const plusSign = (
    <span className="add-sign">
      <FontAwesomeIcon icon="plus" />
    </span>
  );

  const caretDown = (
    <span className="caret">
      <FontAwesomeIcon icon="caret-down" />
    </span>
  );

  const caretUp = (
    <span className="caret">
      <FontAwesomeIcon icon="caret-up" />
    </span>
  );

  useEffect(() => {
    if (allNodes) {
      allNodes.push(...mockNodes);
      nodesDispatcher({
        type: 'set',
        nodes: allNodes
      });
    }
  }, [allNodes]);

  useEffect(() => {
    if (localNode) {
      nodesDispatcher({
        type: 'select',
        node: localNode
      });
    }
  }, [localNode]);

  return (
    <div className="circuit-proposal-form">
      <MultiStepForm
        formName="Propose Circuit"
        handleSubmit={() => {}}
        disabled={!nodesAreValid()}
      >
        <Step step={1} label="Add Nodes">
          <div className="node-registry-wrapper">
            <div className="selected-nodes-header">
              <div className="title">Selected nodes</div>
            </div>
            <div className="form-error">{nodesState.error}</div>
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
                        nodesDispatcher({ type: 'removeSelect', node });
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
                      nodesDispatcher({
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
              <NodeList
                nodes={nodesState.filteredNodes.nodes}
                onClickFn={node => {
                  nodesDispatcher({
                    type: 'select',
                    node
                  });
                }}
              />
            </div>
          </div>
          <OverlayModal open={modalActive}>
            <NewNodeForm
              closeFn={() => setModalActive(false)}
              successCallback={node => {
                nodesDispatcher({
                  type: 'select',
                  node
                });
              }}
            />
          </OverlayModal>
        </Step>
        <Step step={2} label="Add services">
          <div className="services-wrapper">
            <div className="input-wrapper">
              <div className="label">Service ID</div>
              <input type="text" value="" onChange={e => {}} />
              <div className="form-error">{}</div>
            </div>
            <div className="input-wrapper">
              <div className="label">Service type</div>
              <input type="text" value="" onChange={e => {}} />
              <div className="form-error">{}</div>
            </div>
            <div className="input-wrapper span-col-2">
              <div className="label">Allowed nodes</div>
              <div
                className="allowed-nodes-dropdown"
                onClick={() => allowedNodesDispatch({ type: 'toggle-show' })}
              >

                {Object.keys(allowedNodes.selectedNodes).join(', ')}
                {allowedNodes.show ? caretUp : caretDown}
              </div>
              <div
                className={
                  allowedNodes.show
                    ? 'allowed-nodes-list'
                    : 'allowed-nodes-list hide'
                }
              >
                <NodeList
                  nodes={nodesState.selectedNodes}
                  onClickFn={node => {
                    allowedNodesDispatch({ type: 'toggle-select', node });
                  }}
                />
              </div>
              <div className="form-error">{}</div>
            </div>
          </div>
        </Step>
        <Step step={3} label="Configure circuit">
          <input type="text" placeholder="test" />
        </Step>
        <Step step={4} label="Add metadata">
          <input type="text" placeholder="test" />
        </Step>
        <Step step={5} label="Review and submit">
          <input type="text" placeholder="test" />
        </Step>
      </MultiStepForm>
    </div>
  );
}
