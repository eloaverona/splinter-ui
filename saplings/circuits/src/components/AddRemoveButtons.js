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

import './AddRemoveButtons.scss';

const AddButton = ({ actionFn, display }) => {
  if (!display) {
    return '';
  }

  const plusSign = (
    <span className="sign plus">
      <FontAwesomeIcon icon="plus-circle" />
    </span>
  );

  return (
    <button type="button" className="add-button" onClick={actionFn}>
      {plusSign}
    </button>
  );
};

AddButton.propTypes = {
  actionFn: PropTypes.func.isRequired,
  display: PropTypes.bool
};

AddButton.defaultProps = {
  display: false
};

const RemoveButton = ({ actionFn, display }) => {
  if (!display) {
    return '';
  }
  const minusSign = (
    <span className="sign minus">
      <FontAwesomeIcon icon="minus-circle" />
    </span>
  );

  return (
    <button className="remove-button" type="button" onClick={actionFn}>
      {minusSign}
    </button>
  );
};

RemoveButton.propTypes = {
  actionFn: PropTypes.func.isRequired,
  display: PropTypes.bool
};

RemoveButton.defaultProps = {
  display: false
};

export { AddButton, RemoveButton };
