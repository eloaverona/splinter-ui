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
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import nodeIcon from '../images/node_icon.svg';
import { Node } from '../data/nodeRegistry';

import './NodeCard.scss';

const NodeCard = ({ node, isLocal }) => {
  if (!node) {
    return '';
  }

  return (
    <div className="node-card">
      <span className="node-field node-name">
        <img src={nodeIcon} className="node-icon" alt="Icon for a node" />
        {node.displayName}
      </span>
      <span className="node-field node-id">{node.identity}</span>
      <span className="node-local">{isLocal ? 'Local' : ''}</span>
    </div>
  );
};

NodeCard.propTypes = {
  isLocal: PropTypes.bool,
  node: PropTypes.instanceOf(Node).isRequired
};

NodeCard.defaultProps = {
  isLocal: false
};

export default NodeCard;
