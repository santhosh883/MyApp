/*
 * This file is intended to be used to setup Mocha or other dependent libs before tests are run.
 */

class SessionStorage {
  constructor() {
    this.data = {};
  }
  getItem(k) {
    return this.data[k];
  }
  setItem(k, v) {
    this.data[k] = JSON.stringify(v);
    return v;
  }
}
global.sessionStorage = new SessionStorage();

import Datapoint from 'iss/CustomScoring/react/models/Datapoint.jsx';
import DataTypes from 'iss/CustomScoring/react/models/DataTypes.js';
import Factor from 'iss/CustomScoring/react/models/Factor.js';

Datapoint.allFactors = [
  new Factor({
    name: 'Boolean Datapoint',
    code: 'boolean-datapoint',
    dataType: {
      baseType: DataTypes.BOOLEAN,
      map: false,
      numeric: false,
    },
  }),
  new Factor({
    name: 'Numeric Step Datapoint',
    code: 'numeric-step-datapoint',
    dataType: {
      baseType: DataTypes.DOUBLE,
      map: false,
      numeric: true,
    },
  }),
  new Factor({
    name: 'Numeric Linear Datapoint',
    code: 'numeric-linear-datapoint',
    dataType: {
      baseType: DataTypes.INTEGER,
      map: false,
      numeric: true,
    },
  }),
  new Factor({
    name: 'Enumeration (keys) String Datapoint',
    code: 'enumeration-keys-string-datapoint',
    dataType: {
      baseType: DataTypes.STRING,
      map: false,
      numeric: false,
    },
    ddEnumeration: {
      enumerationValue: {
        keys: ['A', 'B', 'C'],
        values: null,
      },
    },
  }),
  new Factor({
    name: 'Enumeration (values) String Datapoint',
    code: 'enumeration-values-string-datapoint',
    dataType: {
      baseType: DataTypes.STRING,
      map: false,
      numeric: false,
    },
    ddEnumeration: {
      enumerationValue: {
        keys: null,
        values: ['1', '2', '3'],
      },
    },
  }),
];

const originalFind = Datapoint.allFactors.find;
Datapoint.allFactors.find = (criteria) => {
  const value = originalFind.call(Datapoint.allFactors, criteria);
  if (value) {
    return value;
  }
  return new Factor({
    name: undefined,
    code: 'default',
    dataType: {
      baseType: DataTypes.INTEGER,
      map: false,
      numeric: true,
    },
  });
};
