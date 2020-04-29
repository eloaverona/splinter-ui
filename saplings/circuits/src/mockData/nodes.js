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
    identity: 'alpha-node-001',
    endpoint: ['tls://splinterd-alpha:8044'],
    displayName: 'Alpha - Node 1',
    metadata: {
      organization: 'Alpha'
    }
  },
  {
    identity: 'beta-node-002',
    endpoint: ['tls://splinterd-beta:8044'],
    displayName: 'Beta - Node 1',
    metadata: {
      organization: 'Beta'
    }
  },
  {
    identity: 'gamma-node-002',
    endpoint: ['tls://splinterd-beta:8044'],
    displayName: 'Gamma - Node 1',
    metadata: {
      organization: 'Beta'
    }
  },
  {
    identity: 'gamma-node-001',
    endpoint: ['tls://splinterd-beta:8044'],
    displayName: 'Gamma - Node 0',
    metadata: {
      organization: 'Beta'
    }
  }
];
