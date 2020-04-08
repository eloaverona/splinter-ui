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

export default [
  {
    proposal_type: 'Create',
    circuit_id: '01234-ABCDE',
    circuit_hash:
      '8ce518770b962429a953b10220905ac9adf86a855f0b085695f444edf991b8ca',
    circuit: {
      circuit_id: '01234-ABCDE',
      members: [
        {
          node_id: 'alpha-node-000',
          endpoint: 'tls://splinterd-alpha:8044'
        },
        {
          node_id: 'beta-node-000',
          endpoint: 'tls://splinterd-beta:8044'
        }
      ],
      roster: [
        {
          service_id: 'FGHI',
          service_type: 'scabbard',
          allowed_nodes: ['alpha-node-000'],
          arguments: {
            peer_services: ['JKLM'],
            admin_keys: [
              '029150e180d57a8d5babde0ea6ae86193fcef7d40ae145b571b0654bf23071b169'
            ]
          }
        },
        {
          service_id: 'JKLM',
          service_type: 'scabbard',
          allowed_nodes: ['beta-node-000'],
          arguments: {
            peer_services: ['FGHI'],
            admin_keys: [
              '029150e180d57a8d5babde0ea6ae86193fcef7d40ae145b571b0654bf23071b169'
            ]
          }
        }
      ],
      management_type: 'gameroom',
      application_metadata:
        '7b2273636162626172645f61646d696e5f6b657973223a5b223',
      comments: 'Alpha/Beta Circuit'
    },
    votes: [
      {
        public_key:
          '026c889058c2d22558ead2c61b321634b74e705c42f890e6b7bc2c80abb4713118',
        vote: 'Accept',
        voter_node_id: 'alpha-node-000'
      }
    ],
    requester:
      '026c889058c2d22558ead2c61b321634b74e705c42f890e6b7bc2c80abb4713118',
    requester_node_id: 'alpha-node-000'
  }
];
