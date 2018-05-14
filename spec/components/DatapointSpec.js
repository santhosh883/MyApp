const expect = require('chai').expect;

import Immutable from 'immutable';

import Datapoint, { createDatapoint } from 'iss/CustomScoring/react/models/Datapoint.jsx';
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
];

const factor = (code) => Immutable.List(Datapoint.allFactors).find((e) => e.code === code);

describe('Datapoint', () => {
  const booleanDatapoint = createDatapoint({
    code: factor('boolean-datapoint').code,
    name: 'foobar',
    weight: 100,
  });

  describe('creation', () => {
    it('should create a func', () => {
      expect(!!booleanDatapoint.func).to.equal(true);
    });

    it('should set the func', () => {
      expect(booleanDatapoint.func.inputs.length).to.equal(6);
      expect(booleanDatapoint.func.inputs.map((e) => e.points)).to.deep.equal([0, 0, 0, 0, 0, 0]);
      expect(booleanDatapoint.func.inputs[0].value).to.equal(true);
      expect(booleanDatapoint.func.inputs[1].value).to.equal(false);
    });
  });

  describe('updating func inputs', () => {
    describe('points', () => {
      let newDatapoint = booleanDatapoint.updateFunctionInput({
        index: 1,
        input: Immutable.Map(booleanDatapoint.func.inputs[1])
          .set('points', 15)
          .toJS(),
      });

      it('should not change the original input', () => {
        expect(booleanDatapoint.func.inputs[1].value).to.equal(false);
        expect(booleanDatapoint.func.inputs[1].points).to.equal(0);
      });

      it('should update the input with a new set of points', () => {
        expect(newDatapoint.func.inputs[1].points).to.equal(15);
      });

      it('should not change the input value', () => {
        expect(newDatapoint.func.inputs[1].value).to.equal(booleanDatapoint.func.inputs[1].value);
      });

      it('should create a new datapoint', () => {
        expect(newDatapoint).to.not.equal(booleanDatapoint);
      });
    });
  });
});
