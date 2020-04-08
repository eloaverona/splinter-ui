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
import mockCircuits from '../mockData/mockCircuits';
import mockProposals from '../mockData/mockProposals';

import './Content.scss';

const Content = () => {
  const localNodeId = 'beta-node-000';
  const totalCircuits = mockCircuits.length + mockProposals.length;
  const actionRequired = mockProposals.filter(
    proposal =>
      proposal.votes.filter(vote => vote.voter_node_id === localNodeId) // local node has a vote
        .length === 0
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
    </div>
  );
};

export default Content;
