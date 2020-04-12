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

import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import mockCircuits from '../mockData/mockCircuits';
import mockProposals from '../mockData/mockProposals';

import { useLocalNodeState } from '../state/localNode';
import { processCircuits, Circuit } from '../data/processCircuits';

import './CircuitsTable.scss';

const sortCircuitsReducer = (state, action) => {
  const order = action.orderAsc ? -1 : 1;
  switch (action.type) {
    case 'comments': {
      const sorted = state.circuits.sort((circuitA, circuitB) => {
        if (circuitA.comments < circuitB.comments) {
          return order;
        }
        if (circuitA.comments > circuitB.comments) {
          return -order;
        }
        return 0;
      });

      return { circuits: sorted };
    }
    case 'circuitID': {
      const sorted = state.circuits.sort((circuitA, circuitB) => {
        if (circuitA.id < circuitB.id) {
          return order;
        }
        if (circuitA.id > circuitB.id) {
          return -order;
        }
        return 0;
      });

      return { circuits: sorted };
    }
    case 'serviceCount': {
      const sorted = state.circuits.sort((circuitA, circuitB) => {
        if (circuitA.roster.length < circuitB.roster.length) {
          return order;
        }
        if (circuitA.roster.length > circuitB.roster.length) {
          return -order;
        }
        return 0;
      });

      return { circuits: sorted };
    }
    case 'managementType': {
      const sorted = state.circuits.sort((circuitA, circuitB) => {
        if (circuitA.managementType < circuitB.managementType) {
          return order;
        }
        if (circuitA.managementType > circuitB.managementType) {
          return -order;
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
  const [sorted, setSortedAsc] = useState({ asc: false, field: '' });
  const sortCircuits = sortBy => {
    setSortedAsc({ asc: !sorted.asc, field: sortBy });
    sort({ type: sortBy, orderAsc: sorted.asc });
  };

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

  const circle = <span className="caret">●</span>;

  const sortSymbol = fieldType => {
    if (sorted.field !== fieldType) {
      return circle;
    }
    if (sorted.asc) {
      return caretUp;
    }
    return caretDown;
  };

  return (
    <tr className="table-header">
      <th onClick={() => sortCircuits('comments')}>
        Comments
        {sortSymbol('comments')}
      </th>
      <th onClick={() => sortCircuits('circuitID')}>
        Circuit ID
        {sortSymbol('circuitID')}
      </th>
      <th onClick={() => sortCircuits('serviceCount')}>
        Service count
        {sortSymbol('serviceCount')}
      </th>
      <th onClick={() => sortCircuits('managementType')}>
        Management Type
        {sortSymbol('managementType')}
      </th>
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
    <tr className="table-row">
      <td>{circuit.comments}</td>
      <td>{circuit.id}</td>
      <td>{circuit.roster.length}</td>
      <td>{circuit.managementType}</td>
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
  const [circuitState, circuitsDispatch] = useReducer(sortCircuitsReducer, {
    circuits
  });

  return (
    <div>
      <table className="circuits-table">
        <TableHeader sort={circuitsDispatch} />
        {circuitState.circuits.map(item => {
          return <TableRow circuit={item} />;
        })}
      </table>
    </div>
  );
};

export default CircuitsTable;
