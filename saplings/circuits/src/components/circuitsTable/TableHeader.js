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
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocalNodeState } from '../../state/localNode';
import { Circuit } from '../../data/processCircuits';

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

const filterCircuits = (circuits, filterBy) => {
  const filteredCircuits = circuits.filter(circuit => {
    let include = false;
    if (filterBy.awaitingApproval) {
      include = include || circuit.awaitingApproval();
    }
    if (filterBy.actionRequired) {
      include = include || circuit.actionRequired(filterBy.nodeID);
    }
    if (!filterBy.awaitingApproval && !filterBy.actionRequired) {
      include = true;
    }
    return include;
  });
  return filteredCircuits;
};

const filtersReducer = (state, action) => {
  switch (action.type) {
    case 'show': {
      // reset any filter that was no applied
      const stageActionRequired = state.actionRequired;
      const stageAwaitingApproval = state.awaitingApproval;
      return {
        ...state,
        show: !state.show,
        stageActionRequired,
        stageAwaitingApproval
      };
    }
    case 'stage': {
      const { stageActionRequired, stageAwaitingApproval } = action;
      return { ...state, stageActionRequired, stageAwaitingApproval };
    }
    case 'apply': {
      const actionRequired = state.stageActionRequired;
      const awaitingApproval = state.stageAwaitingApproval;
      return { ...state, actionRequired, awaitingApproval, show: false };
    }
    default:
      throw new Error(`unhandled action type: ${action.type}`);
  }
};

const TableHeader = ({ dispatch, circuits }) => {
  const nodeID = useLocalNodeState();
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

  const sortableSymbol = (
    <span className="caret">
      <FontAwesomeIcon icon="sort" />
    </span>
  );

  const sortSymbol = fieldType => {
    if (sorted.field !== fieldType) {
      return sortableSymbol;
    }
    if (sorted.asc) {
      return caretUp;
    }
    return caretDown;
  };

  const filterSymbol = (
    <span className="caret filterSymbol">
      <FontAwesomeIcon icon="filter" />
    </span>
  );

  const exclamationCircle = (
    <span className="status-icon action-required">
      <FontAwesomeIcon icon="exclamation-circle" />
    </span>
  );

  const businessTime = (
    <span className="status-icon awaiting-approval">
      <FontAwesomeIcon icon="business-time" />
    </span>
  );

  const checkMark = hidden => {
    return (
      <span className={hidden ? 'status-icon hidden' : 'status-icon'}>
        <FontAwesomeIcon icon="check" />
      </span>
    );
  };

  const [filterSettings, setFilterSettings] = useReducer(filtersReducer, {
    show: false,
    actionRequired: false,
    awaitingApproval: false,
    stageActionRequired: false,
    stageAwaitingApproval: false
  });

  const filterOptions = (
    <div className={filterSettings.show ? 'filterStatus show' : 'filterStatus'}>
      <div className="statusOptions">
        <button
          className="filterOption"
          type="button"
          onClick={() => {
            setFilterSettings({
              type: 'stage',
              stageActionRequired: !filterSettings.stageActionRequired,
              stageAwaitingApproval: filterSettings.stageAwaitingApproval
            });
          }}
        >
          {exclamationCircle}
          Action required
          {checkMark(!filterSettings.stageActionRequired)}
        </button>
        <button
          className="filterOption"
          type="button"
          onClick={() => {
            setFilterSettings({
              type: 'stage',
              stageActionRequired: filterSettings.stageActionRequired,
              stageAwaitingApproval: !filterSettings.stageAwaitingApproval
            });
          }}
        >
          {businessTime}
          Awaiting approval
          {checkMark(!filterSettings.stageAwaitingApproval)}
        </button>
        <button
          type="button"
          onClick={() => {
            setFilterSettings({
              type: 'apply'
            });

            dispatch({
              type: 'filterByStatus',
              filterCircuits,
              filter: {
                awaitingApproval: filterSettings.stageAwaitingApproval,
                actionRequired: filterSettings.stageActionRequired,
                nodeID
              }
            });
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );

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
      <th>
        <div className="status-dropdown">
          <button
            type="button"
            onClick={() => {
              setFilterSettings({
                type: 'show'
              });
            }}
          >
            Status
            {filterSymbol}
          </button>
          {filterOptions}
        </div>
      </th>
    </tr>
  );
};

TableHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  circuits: PropTypes.arrayOf(Circuit).isRequired
};

export default TableHeader;