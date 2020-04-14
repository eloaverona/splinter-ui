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
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocalNodeState } from '../state/localNode';
import { Circuit } from '../data/processCircuits';

import './CircuitsTable.scss';

const sortCircuits = (circuits, action) => {
  const order = action.orderAsc ? -1 : 1;
  switch (action.sortBy) {
    case 'comments': {
      const sorted = circuits.sort((circuitA, circuitB) => {
        if (circuitA.comments === 'N/A' && circuitB.comments !== 'N/A') {
          return 1; // 'N/A should always be at the bottom'
        }
        if (circuitA.comments !== 'N/A' && circuitB.comments === 'N/A') {
          return -1; // 'N/A should always be at the bottom'
        }
        if (circuitA.comments < circuitB.comments) {
          return order;
        }
        if (circuitA.comments > circuitB.comments) {
          return -order;
        }
        return 0;
      });

      return sorted;
    }
    case 'circuitID': {
      const sorted = circuits.sort((circuitA, circuitB) => {
        if (circuitA.id < circuitB.id) {
          return order;
        }
        if (circuitA.id > circuitB.id) {
          return -order;
        }
        return 0;
      });

      return sorted;
    }
    case 'serviceCount': {
      const sorted = circuits.sort((circuitA, circuitB) => {
        if (circuitA.roster.length < circuitB.roster.length) {
          return order;
        }
        if (circuitA.roster.length > circuitB.roster.length) {
          return -order;
        }
        return 0;
      });

      return sorted;
    }
    case 'managementType': {
      const sorted = circuits.sort((circuitA, circuitB) => {
        if (circuitA.managementType < circuitB.managementType) {
          return order;
        }
        if (circuitA.managementType > circuitB.managementType) {
          return -order;
        }
        return 0;
      });

      return sorted;
    }
    default:
      return circuits;
  }
};

const TableHeader = ({ dispatch, circuits }) => {
  const [sorted, setSortedAsc] = useState({ asc: false, field: '' });
  const sortCircuitsBy = (sortBy, order) => {
    setSortedAsc({ asc: order, field: sortBy });
    dispatch({
      type: 'sort',
      sortCircuits,
      sort: { sortBy, orderAsc: order }
    });
  };

  useEffect(() => {
    sortCircuitsBy(sorted.field, sorted.asc);
  }, [circuits]);

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
      <th onClick={() => sortCircuitsBy('comments', !sorted.asc)}>
        Comments
        {sortSymbol('comments')}
      </th>
      <th onClick={() => sortCircuitsBy('circuitID', !sorted.asc)}>
        Circuit ID
        {sortSymbol('circuitID')}
      </th>
      <th onClick={() => sortCircuitsBy('serviceCount', !sorted.asc)}>
        Service count
        {sortSymbol('serviceCount')}
      </th>
      <th onClick={() => sortCircuitsBy('managementType', !sorted.asc)}>
        Management Type
        {sortSymbol('managementType')}
      </th>
      <th>Status</th>
    </tr>
  );
};

TableHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  circuits: PropTypes.arrayOf(Circuit).isRequired
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
  const nodeID = useLocalNodeState();
  return (
    <tr className="table-row">
      <td
        className={
          circuit.comments === 'N/A'
            ? 'ellipsis-overflow text-grey'
            : 'ellipsis-overflow'
        }
      >
        {circuit.comments}
      </td>
      <td className="text-highlight">{circuit.id}</td>
      <td>
        {
          new Set(
            circuit.roster.map(service => {
              return service.service_type;
            })
          ).size
        }
      </td>
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
    <div className="table-container">
      <table className="circuits-table">
        <TableHeader dispatch={dispatch} circuits={circuits} />
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
