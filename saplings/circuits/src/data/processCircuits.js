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

function Circuit(data) {
  if (data.proposal_type) {
    this.id = data.circuit_id;
    this.status = 'Pending';
    this.members = data.circuit.members;
    this.roster = data.circuit.roster;
    this.management_type = data.circuit.management_type;
    this.application_metadata = data.circuit.application_metadata;
    this.comments = data.circuit.comments;
    this.proposal = {
      votes: data.votes,
      requester: data.requester,
      requester_node_id: data.requester_node_id,
      proposalType: data.proposal_type
    };
  } else {
    this.id = data.id;
    this.status = 'Active';
    this.members = data.members;
    this.roster = data.roster;
    this.management_type = data.management_type;
    this.application_metadata = data.application_metadata;
    this.comments = 'N/A';
    this.proposal = {};
  }
}

Circuit.prototype.awaitingApproval = function() {
  if (this.status === 'Pending') {
    return true;
  }
  return false;
};

Circuit.prototype.actionRequired = function(nodeID) {
  if (
    this.awaitingApproval() &&
    this.proposal.votes.filter(vote => vote.voter_node_id === nodeID).length ===
      0
  ) {
    return true;
  }
  return false;
};

const processCircuits = circuits => {
  return circuits.map(item => {
    return new Circuit(item);
  });
};

export { processCircuits, Circuit };
