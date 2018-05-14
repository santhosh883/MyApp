const expect = require('chai').expect;

import DataTypes from 'iss/CustomScoring/react/models/DataTypes.js';
import Factor from 'iss/CustomScoring/react/models/Factor.js';

describe('Factor', () => {
  const applicableIssuerTypes = ['Board', 'ESG', 'ESGDetail', 'Issuer', 'IssuerDetail', 'QuickScore', 'SRI'];

  describe('#isApplicableToCustomScoringModelEditor', () => {
    const nonIssuerFactor = new Factor({ entityTypeCode: 'Person' });
    const currencyFactor = new Factor({ entityTypeCode: 'Issuer', currency: true });
    const mapFactor = new Factor({ entityTypeCode: 'IssuerDetail', dataType: { map: true } });

    applicableIssuerTypes.forEach((issuerType) => {
      it(`${issuerType} factor should be applicable`, () => {
        const factor = new Factor({ entityTypeCode: issuerType });
        expect(factor.isApplicableToCustomScoringModelEditor()).to.be.true;
      });
    });

    it('currencyFactor should not be applicable', () => {
      expect(currencyFactor.isApplicableToCustomScoringModelEditor()).to.be.false;
    });

    it('mapFactor should not be applicable', () => {
      expect(mapFactor.isApplicableToCustomScoringModelEditor()).to.be.false;
    });

    it('nonIssuerFactor should not be applicable', () => {
      expect(nonIssuerFactor.isApplicableToCustomScoringModelEditor()).to.be.false;
    });
  });

  describe('#isBoolean', () => {
    const booleanFactor = new Factor({ dataType: { baseType: DataTypes.BOOLEAN } });
    const nonBooleanFactor = new Factor({ dataType: { baseType: DataTypes.DOUBLE } });

    it('should be true', () => {
      expect(booleanFactor.isBoolean()).to.be.true;
    });

    it('should be false', () => {
      expect(nonBooleanFactor.isBoolean()).to.be.false;
    });
  });

  describe('#isCase', () => {
    it('should be true', () => {
      const factor = new Factor({ entityTypeCode: 'Case' });
      expect(factor.isCase()).to.be.true;
    });

    it('should be false', () => {
      const factor = new Factor({ entityTypeCode: 'Person' });
      expect(factor.isCase()).to.be.false;
    });
  });

  describe('#isIssuer', () => {
    applicableIssuerTypes.forEach((issuerType) => {
      it(`${issuerType} factor should be true`, () => {
        const factor = new Factor({ entityTypeCode: issuerType });
        expect(factor.isIssuer()).to.be.true;
      });
    });

    it('should be false', () => {
      const factor = new Factor({ entityTypeCode: 'Case' });
      expect(factor.isIssuer()).to.be.false;
    });
  });

  describe('#isNumeric', () => {
    [DataTypes.DOUBLE, DataTypes.INTEGER].forEach((baseType) => {
      it(`${baseType} factor should be true`, () => {
        const factor = new Factor({ dataType: { baseType } });
        expect(factor.isNumeric()).to.be.true;
      });
    });

    it('should be false', () => {
      const factor = new Factor({ dataType: { baseType: 'non numeric' } });
      expect(factor.isNumeric()).to.be.false;
    });
  });

  describe('#isPerson', () => {
    it('should be true', () => {
      const factor = new Factor({ entityTypeCode: 'Person' });
      expect(factor.isPerson()).to.be.true;
    });

    it('should be false', () => {
      const factor = new Factor({ entityTypeCode: 'Board' });
      expect(factor.isPerson()).to.be.false;
    });
  });

  describe('#resolvedDataType', () => {
    it('should be unknown', () => {
      const factor = new Factor();
      expect(factor.resolvedDataType()).to.equal('unknown');
    });

    it('should return the base type', () => {
      const factor = new Factor({ dataType: { baseType: 'some base type' } });
      expect(factor.resolvedDataType()).to.equal('some base type');
    });
  });
});
