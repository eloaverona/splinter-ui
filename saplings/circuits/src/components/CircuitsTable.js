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

import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import mockCircuits from '../mockData/mockCircuits';
import mockProposals from '../mockData/mockProposals';

import { useLocalNodeState } from '../state/localNode';
import { processCircuits, Circuit } from '../data/processCircuits';

const sortCircuits = (state, action) => {
  switch (action.type) {
    case 'alias': {
      const sorted = state.circuits.sort((circuitA, circuitB) => {
        if (circuitA.comments < circuitB.comments) {
          return -1;
        }
        if (circuitA.comments > circuitB.comments) {
          return 1;
        }
        return 0;
      });

      return { circuits: sorted };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

const TableHeader = ({ sort }) => {
  return (
    <tr>
      <th onClick={() => sort({ type: 'alias', order: 'asc' })}>Alias</th>
      <th>Circuit ID</th>
      <th>Count of services</th>
      <th>Management Type</th>
      <th>Status</th>
    </tr>
  );
};

TableHeader.propTypes = {
  sort: PropTypes.func.isRequired
};

const proposalStatus = (circuit, nodeID) => {
  const awaiting = <span className="awaiting-approval">Awaiting Approval</span>;
  return (
    <div className="proposalStatus">
      {awaiting}
      {circuit.actionRequired(nodeID) ? (
        <span className="action-required">Action Required</span>
      ) : (
        ''
      )}
    </div>
  );
};

const TableRow = ({ circuit }) => {
  const nodeID = 'beta-node-000'; //useLocalNodeState();
  return (
    <tr>
      <td>{circuit.comments}</td>
      <td>{circuit.id}</td>
      <td>{circuit.roster.length}</td>
      <td>{circuit.management_type}</td>
      <td>
        {circuit.awaitingApproval() ? proposalStatus(circuit, nodeID) : ''}
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  circuit: PropTypes.instanceOf(Circuit).isRequired
};

const CircuitsTable = () => {
  const circuits = processCircuits(mockCircuits.concat(mockProposals));
  const [circuitState, circuitsDispatch] = useReducer(sortCircuits, {
    circuits
  });

  return (
    <div>
      <table>
        <TableHeader sort={circuitsDispatch} />
        {circuitState.circuits.map(item => {
          return <TableRow circuit={item} />;
        })}
      </table>
    </div>
  );
};

export default CircuitsTable;
