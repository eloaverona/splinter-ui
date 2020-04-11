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

const CircuitsTable = () => {
  const circuits = mockCircuits.concat(mockProposals);
  const tableHeader = (
    <tr>
      <th>Alias</th>
      <th>Circuit ID</th>
      <th>Count of services</th>
      <th>Management Type</th>
      <th>Status</th>
    </tr>
  );

  return (
    <table>
      {tableHeader}
      {circuits.map(function(item) {
        return <TableRow circuit={item} />;
      })}
    </table>
  );
  // const tableRow = (circuit) => {
  //
  // };
};

const TableRow = props => {
  const data = props.circuit;
  // const tableHeader = (
  //   <tr>
  //     <th>Alias</th>
  //     <th>Circuit ID</th>
  //     <th>Count of services</th>
  //     <th>Management Type</th>
  //     <th>Status</th>
  //   </tr>
  // );
  //
  console.log('DATA');

  console.log(data);
  return (
    <tr>
      <td>{data.circuit ? data.circuit.comments : 'N/A'}</td>
      <td>{data.circuit_id ? data.circuit_id : data.id}</td>
      <td>{data.circuit ? data.circuit.roster.length : data.roster.length}</td>
      <td>
        {data.circuit ? data.circuit.management_type : data.management_type}
      </td>
      <td>{data.circuit ? 'Awaiting Approval' : ''}</td>
    </tr>
  );
  // const tableRow = (circuit) => {
  //
  // };
};

export default CircuitsTable;
