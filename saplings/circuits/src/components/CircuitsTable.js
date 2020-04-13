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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocalNodeState } from '../state/localNode';
import { Circuit } from '../data/processCircuits';

import './CircuitsTable.scss';

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
  const exclamation = (
    <span className="status-icon">
      <FontAwesomeIcon icon="exclamation" />
    </span>
  );
  const awaiting = (
    <span className="status awaiting-approval">Awaiting Approval</span>
  );
  return (
    <div className="proposal-status">
      {circuit.actionRequired(nodeID) ? (
        <span className="status action-required">
          Action Required
          {exclamation}
        </span>
      ) : (
        ''
      )}
      {awaiting}
    </div>
  );
};

const TableRow = ({ circuit }) => {
  const nodeID = 'beta-node-000'; //useLocalNodeState();
  return (
    <tr className="table-row">
      <td className={circuit.comments === 'N/A' ? 'text-grey' : ''}>
        {circuit.comments}
      </td>
      <td className="text-highlight">{circuit.id}</td>
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

const CircuitsTable = ({ circuits, dispatch }) => {
  return (
    <div>
      <table className="circuits-table">
        <TableHeader sort={dispatch} />
        {circuits.map(item => {
          return <TableRow circuit={item} />;
        })}
      </table>
    </div>
  );
};

CircuitsTable.propTypes = {
  circuits: PropTypes.arrayOf(Circuit).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default CircuitsTable;
