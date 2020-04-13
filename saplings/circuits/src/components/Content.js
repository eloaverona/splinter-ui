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
import { useLocalNodeState } from '../state/localNode';
import { useCircuitsState } from '../state/circuits';

import CircuitsTable from './CircuitsTable';

import './Content.scss';

const Content = () => {
  const nodeID = useLocalNodeState();
  const [circuitState, circuitsDispatch] = useCircuitsState();
  const totalCircuits = circuitState.circuits.length;
  const actionRequired = circuitState.circuits.filter(circuit =>
    circuit.actionRequired(nodeID)
  ).length;

  return (
    <div className="content">
      <div className="midContent">
        <div className="circuit-stats">
          <div className="stat total-circuits">
            <span className="stat-count circuits-count">{totalCircuits}</span>
            Total circuits
          </div>
          <div className="stat action-required">
            <span className="stat-count action-required-count">
              {actionRequired}
            </span>
            Action Required
          </div>
        </div>
        <input className="filterTable" type="text" placeholder="Filter" />
      </div>
      <CircuitsTable
        circuits={circuitState.circuits}
        dispatch={circuitsDispatch}
      />
    </div>
  );
};

export default Content;
