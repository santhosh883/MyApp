const expect = require('chai').expect;

import { userName } from 'iss/CustomScoring/react/utils/appConstants.js';
import CustomScoringModel from 'iss/CustomScoring/react/models/CustomScoringModel.jsx';
import Datapoint, { createDatapoint } from 'iss/CustomScoring/react/models/Datapoint.jsx';
import Pillar from 'iss/CustomScoring/react/models/Pillar.jsx';

describe('CustomScoringModel', () => {
  let esWeapons = new Pillar({ name: 'Weapons', weight: 50.0 })
    .addDatapoint(createDatapoint({ name: 'BiologicalWeaponsOverallFlag', weight: 20.0 }))
    .addDatapoint(createDatapoint({ name: 'DepletedUraniumTotalAmbers', weight: 80.0 }));
  let esNbsOther = new Pillar({ name: 'Other', weight: 100.0 })
    .addDatapoint(createDatapoint({ name: 'NBSOverallScore', weight: 10.0 }))
    .addDatapoint(createDatapoint({ name: 'NBSTotalAmbers', weight: 90.0 }));
  let esNbs = new Pillar({ name: 'NBS', weight: 50.0 }).addPillar(esNbsOther);
  let es = new Pillar({ name: 'ES', weight: 20.0 }).addPillar(esWeapons).addPillar(esNbs);

  let govBoardDirectorPay = new Pillar({ name: 'Director Pay', weight: 70.0 })
    .addDatapoint(createDatapoint({ name: 'AvgDirectorCompTotalUSD', weight: 10.0 }))
    .addDatapoint(createDatapoint({ name: 'AnnualRetainerFeeTotalUSD', weight: 100.0 }));
  let govBoard = new Pillar({ name: 'Board', weight: 30.0 })
    .addPillar(govBoardDirectorPay)
    .addDatapoint(createDatapoint({ name: 'BoardIndependenceRatioPAS', weight: 25.0 }))
    .addDatapoint(createDatapoint({ name: 'AvgDirectorAge', weight: 45.0 }));
  let governance = new Pillar({ name: 'Governance', weight: 60.0 }).addPillar(govBoard);

  let other = new Pillar({ name: 'Other', weight: 20.0 }).addDatapoint(
    createDatapoint({ name: 'BoardSize', weight: 30.0 })
  );

  const baseModel = new CustomScoringModel({ name: 'Base Model', username: 'foobar' })
    .addPillar({ pillar: es })
    .addPillar({ pillar: governance })
    .addPillar({ pillar: other });

  const pillarFilter = (pillarContainer, pillarName) => pillarContainer.pillars.find((e) => e.name === pillarName);
  const pillarIndex = (pillarContainer, pillarName) => pillarContainer.pillars.findIndex((e) => e.name === pillarName);

  describe('copy', () => {
    const model = new CustomScoringModel({
      name: 'foobar',
      username: 'blaargh',
      id: 1,
      pillars: [{ name: 'pillar', weight: 23, datapoints: [{ code: 'datapoint0', weight: 100 }] }],
      datapoints: [{ code: 'datapoint1', weight: 44 }, { code: 'datapoint2', weight: 33 }],
    });
    const clone = model.copy();

    it('updates the name with "copy" and a timestamp', () => {
      expect(clone.name).to.match(/foobar copy \d+/);
    });

    it('undefines the id', () => {
      expect(clone.id).to.be.undefined;
    });

    it('resets the uuid', () => {
      expect(clone.uuid).to.not.be.undefined;
      expect(clone.uuid).to.not.equal(model.uuid);
    });

    it('preserves pillars', () => {
      expect(clone.pillars.size).to.equal(1);
      expect(clone.pillars.first().name).to.equal('pillar');
    });

    it('updates pillar uuids', () => {
      expect(clone.pillars.size).to.equal(1);
      expect(clone.pillars.first().uuid).to.not.equal(model.pillars.first().uuid);
    });

    it('preserves pillar datapoints', () => {
      expect(clone.pillars.first().datapoints.size).to.equal(1);
      expect(clone.pillars.first().datapoints.first().name).to.equal('datapoint0');
    });

    it('updates pillar datapoint uuids', () => {
      expect(clone.pillars.size).to.equal(1);
      expect(clone.pillars.first().datapoints.first().uuid).to.not.equal(model.pillars.first().datapoints.first().uuid);
    });

    it('preserves datapoints', () => {
      expect(clone.datapoints.size).to.equal(2);
      expect(clone.datapoints.get(0).code).to.equal('datapoint1');
      expect(clone.datapoints.get(0).weight).to.equal(44);
      expect(clone.datapoints.get(1).code).to.equal('datapoint2');
      expect(clone.datapoints.get(1).weight).to.equal(33);
    });

    it('updates datapoint uuids', () => {
      expect(clone.datapoints.get(0).uuid).to.not.equal('datapoint1');
      expect(clone.datapoints.get(0).uuid).to.not.be.undefined;
      expect(clone.datapoints.get(1).uuid).to.not.equal('datapoint2');
      expect(clone.datapoints.get(1).uuid).to.not.be.undefined;
    });

    it('preserves username', () => {
      expect(clone.username).to.equal(model.username);
    });
  });

  describe('copyIssModel', () => {
    const model = new CustomScoringModel({
      name: 'foobar',
      username: 'blaargh',
      id: 1,
      pillars: [{ name: 'pillar', weight: 23, datapoints: [{ code: 'datapoint0', weight: 100 }] }],
      datapoints: [{ code: 'datapoint1', weight: 44 }, { code: 'datapoint2', weight: 33 }],
    });
    const clone = model.copyIssModel();

    it('keeps the name', () => {
      expect(clone.name).to.equal(model.name);
    });

    it('sets the username to the appConstants userName', () => {
      expect(clone.username).to.equal(userName);
    });
  });

  describe('packageForServer', () => {
    const model = new CustomScoringModel({
      name: 'foobar',
      username: 'Wonder Woman',
      id: 17,
      pillars: [{ name: 'pillar', weight: 50, datapoints: [{ code: 'foo', weight: 20 }, { code: 'bar', weight: 80 }] }],
      datapoints: [{ code: 'the_datapoint', weight: 50 }],
      creationDate: new Date(),
      lastModifiedDate: new Date(),
    });
    const packaged = model.packageForServer();

    it('sets id', () => {
      expect(packaged.id).to.equal(17);
    });

    it('sets name', () => {
      expect(packaged.name).to.equal(model.name);
    });

    it('sets username', () => {
      expect(packaged.username).to.equal(model.username);
    });

    it('gets rid of creation date', () => {
      expect(packaged.creationDate).to.be.undefined;
    });

    it('gets rid of modification date', () => {
      expect(packaged.lastModifiedDate).to.be.undefined;
    });

    it('sets factorNames', () => {
      expect(packaged.factorNames).to.equal('bar|foo|the_datapoint');
    });

    it('sets methodology', () => {
      const json = model.toJS();
      const parsedJSON = JSON.parse(packaged.methodology);
      expect(json.id).to.equal(parsedJSON.id);
      expect(json.uuid).to.equal(parsedJSON.uuid);
      expect(json.username).to.equal(parsedJSON.username);
      expect(json.pillars.length).to.equal(parsedJSON.pillars.length);
      expect(json.pillars[0].uuid).to.equal(parsedJSON.pillars[0].uuid);
      expect(json.datapoints.length).to.equal(parsedJSON.datapoints.length);
      expect(json.datapoints[0].uuid).to.equal(parsedJSON.datapoints[0].uuid);
      expect(json.outputs.length).to.equal(parsedJSON.outputs.length);
      expect(json.overrides.length).to.equal(parsedJSON.overrides.length);
    });
  });

  describe('defaults', () => {
    it('creates a path based on the username and name', () => {
      expect(baseModel.path).to.equal('foobar.base-model');
    });

    it('creates uuid when id is not present', () => {
      const model = new CustomScoringModel({
        name: 'New Model',
        pillars: [es, governance, other],
        username: 'foobar',
      });
      expect(model.id).to.be.undefined;
      expect(model.uuid).to.not.be.undefined;
    });

    it('does not replace uuid when an id is also present', () => {
      const uuid = 'foobar';
      const model = new CustomScoringModel({
        id: 13,
        uuid: uuid,
        name: 'New Model',
        pillars: [es, governance, other],
        username: 'foobar',
      });
      expect(model.id).to.not.be.undefined;
      expect(model.uuid).to.equal(uuid);
    });

    it('replaces uuid when an id is not present', () => {
      const uuid = 'uuid';
      const model = new CustomScoringModel({
        name: 'Base Model',
        pillars: [es, governance, other],
        username: 'foobar',
        uuid: uuid,
      });
      expect(model.id).to.be.undefined;
      expect(model.uuid).to.not.equal(uuid);
      expect(model.uuid).to.not.be.undefined;
    });
  });

  describe('modifying pillars', () => {
    describe('adding a pillar', () => {
      const pillar = new Pillar({ name: 'foobar' });
      describe('at the top-level', () => {
        const newModel = baseModel.addPillar({ pillar });
        it('should add the pillar', () => {
          expect(pillarFilter(newModel, 'foobar')).to.not.be.undefined;
        });

        it('should prepend the pillar path with the model info', () => {
          expect(pillarFilter(newModel, 'foobar').path).to.equal('foobar.base-model.foobar');
        });
      });

      describe('at a sub-level', () => {
        let gov = pillarFilter(baseModel, 'Governance');
        let board = pillarFilter(gov, 'Board');
        let parent = pillarFilter(board, 'Director Pay');
        let newModel = baseModel.addPillar({ pillar, parent });
        gov = pillarFilter(newModel, 'Governance');
        board = pillarFilter(gov, 'Board');
        parent = pillarFilter(board, 'Director Pay');

        it('should add the pillar', () => {
          expect(pillarFilter(parent, 'foobar')).to.not.be.undefined;
        });

        it('should prepend the pillar path with the model info', () => {
          expect(pillarFilter(parent, 'foobar').path).to.equal(
            'foobar.base-model.governance.board.director-pay.foobar'
          );
        });
      });
    });

    describe('updating a top-level pillar name', () => {
      const newName = 'Environmental & Social';
      const oldName = 'ES';
      const pillar = pillarFilter(baseModel, oldName);
      const newModel = () => baseModel.updatePillarName(pillar, newName);

      it('should create a new model', () => {
        expect(newModel()).to.exist;
      });
      it('should not be equal to the base model', () => {
        expect(newModel()).to.not.equal(baseModel);
      });
      it('should no longer have a pillar under the old name', () => {
        expect(pillarFilter(newModel(), oldName)).to.be.undefined;
      });
      it('should have a pillar under the new name', () => {
        expect(pillarFilter(newModel(), newName)).to.not.be.undefined;
      });
      it('should keep the pillars in the same order', () => {
        expect(pillarIndex(newModel(), newName)).to.equal(0);
      });
    });

    describe('updating a top-level pillar weight', () => {
      const newWeight = 59.0;
      const oldWeight = 60.0;
      const pillarName = 'Governance';
      const pillar = pillarFilter(baseModel, pillarName);
      const newModel = () => baseModel.updatePillarWeight(pillar, newWeight);

      it('should create a new model', () => {
        expect(newModel()).to.exist;
      });
      it('should not be equal to the base model', () => {
        expect(newModel()).to.not.equal(baseModel);
      });
      it('should still have a pillar under the old name', () => {
        expect(pillarFilter(newModel(), pillarName)).to.not.be.undefined;
      });
      it('should keep all the pillars in the same order', () => {
        expect(pillarIndex(newModel(), 'ES')).to.equal(0);
        expect(pillarIndex(newModel(), pillarName)).to.equal(1);
        expect(pillarIndex(newModel(), 'Other')).to.equal(2);
      });
    });

    describe('weight', () => {
      describe('#totalWeight', () => {
        it('should be 100.0', () => {
          expect(baseModel.totalWeight()).to.equal(100.0);
        });

        it('should redistribute weights after editing a single weight', () => {
          const pillar = pillarFilter(baseModel, 'Other');
          const newModel = baseModel.updatePillarWeight(pillar, 17);
          expect(newModel.totalWeight()).to.equal(100.0);
        });

        it('should redistribute unlocked weights only', () => {
          const other = pillarFilter(baseModel, 'Other');
          let newModel = baseModel.lockPillarWeight(other);
          let gov = pillarFilter(newModel, 'Governance');
          let es = pillarFilter(newModel, 'ES');
          newModel = newModel.updatePillarWeight(gov, 55);
          es = pillarFilter(newModel, 'ES');
          expect(newModel.totalWeight()).to.equal(100.0);
          expect(es.weight).to.equal(25.0);
        });

        it('should add up to 100 when rounding "Largest Remainder Method" is involved', () => {
          const model = new CustomScoringModel({
            name: 'Base Model',
            username: 'foobar',
          })
            .addPillar({ pillar: es.set('weight', 40) })
            .addPillar({ pillar: governance.set('weight', 30) })
            .addPillar({ pillar: other.set('weight', 30) });
          let gov = pillarFilter(model, 'Governance');
          const newModel = model.updatePillarWeight(gov, 33);
          gov = pillarFilter(newModel, 'Governance');
          es = pillarFilter(newModel, 'ES');
          other = pillarFilter(newModel, 'Other');
          expect(newModel.totalWeight()).to.equal(100.0);
          expect(es.weight).to.equal(39.0);
          expect(other.weight).to.equal(28.0);
          expect(gov.weight).to.equal(33.0);
        });

        it('should reject NaN as a weight', () => {
          const pillar = pillarFilter(baseModel, 'Other');
          const weight = pillar.weight;
          const newModel = baseModel.updatePillarWeight(pillar, Number.parseFloat('not a number'));
          expect(pillar.weight).to.equal(weight);
          expect(newModel.totalWeight()).to.equal(100.0);
        });

        it('should distribute weights to remaining pillars after removing a pillar', () => {
          const model = new CustomScoringModel({
            name: 'Base Model',
            username: 'foobar',
          })
            .addPillar({ pillar: es.set('weight', 30) })
            .addPillar({ pillar: governance.set('weight', 40) })
            .addPillar({ pillar: other.set('weight', 30) });

          let gov = pillarFilter(model, 'Governance');
          const newModel = model.removePillar(gov);
          es = pillarFilter(newModel, 'ES');
          other = pillarFilter(newModel, 'Other');
          expect(newModel.totalWeight()).to.equal(100.0);
          expect(es.weight).to.equal(50);
          expect(other.weight).to.equal(50);
        });
      });

      describe('#totalWeightFormatted', () => {
        it('should be 100.00%', () => {
          expect(baseModel.totalWeightFormatted()).to.equal('100.00%');
        });
      });
    });
  });

  describe('removing pillars', () => {
    describe('at model level', () => {
      it('should remove the pillar and redistribute weights', () => {
        const newModel = baseModel.removePillar(pillarFilter(baseModel, es.name));
        expect(newModel).to.not.equal(baseModel);
        expect(newModel.pillars.size).to.equal(2);
        expect(newModel.pillars.map((e) => e.name).toJS()).to.deep.equal(['Governance', 'Other']);
        expect(newModel.totalWeight()).to.equal(100.0);
      });

      it('should not change a model when model does not own the pillar', () => {
        const newModel = baseModel.removePillar(new Pillar({ name: 'foo', weight: 9 }));
        expect(newModel).to.equal(baseModel);
      });
    });

    describe('in subpillars', () => {
      it('should remove the subpillar and redistribute weights', () => {
        const newModel = baseModel.removePillar(pillarFilter(pillarFilter(baseModel, es.name), esNbs.name));
        expect(pillarFilter(pillarFilter(newModel, es.name), esNbs.name)).to.be.undefined;
        expect(newModel).to.not.equal(baseModel);
        expect(newModel.pillars.size).to.equal(3);
        expect(pillarFilter(newModel, es.name).totalWeight()).to.equal(100.0);
      });

      it('should remove the deeply nested pillar', () => {
        const deeplyNestedPillar = pillarFilter(
          pillarFilter(pillarFilter(baseModel, es.name), esNbs.name),
          esNbsOther.name
        );
        expect(deeplyNestedPillar).to.not.be.undefined;
        const newModel = baseModel.removePillar(deeplyNestedPillar);
        const newDeeplyNestedPillar = pillarFilter(
          pillarFilter(pillarFilter(newModel, es.name), esNbs.name),
          esNbsOther.name
        );
        expect(newDeeplyNestedPillar).to.be.undefined;
        expect(newModel).to.not.equal(baseModel);
        expect(newModel.pillars.size).to.equal(3);
      });
    });
  });

  describe('adding datapoints', () => {
    const datapoint = createDatapoint({
      code: 'new-datapoint',
      name: 'new datapoint',
      weight: 1,
    });

    describe('at model level', () => {
      it('should add the datapoint when no pillar is specified', () => {
        const newModel = baseModel.addDatapointTo(null, datapoint);
        expect(newModel).to.not.equal(baseModel);
        expect(newModel.datapoints.find((d) => d.uuid === datapoint.uuid)).to.equal(datapoint);
      });

      it('should not add the datapoint when a pillar is specified that the model does not own', () => {
        const newModel = baseModel.addDatapointTo(esNbsOther, datapoint);
        expect(newModel).to.equal(baseModel);
        expect(newModel.datapoints.size).to.equal(0);
      });
    });

    describe('at pillar level', () => {
      it('should add the datapoint to the pillar', () => {
        const newModel = baseModel.addDatapointTo(pillarFilter(baseModel, es.name), datapoint);
        const newPillar = pillarFilter(newModel, es.name);
        expect(newModel).to.not.equal(baseModel);
        expect(newPillar.datapoints.size).to.equal(1);
        expect(newPillar.datapoints.find((d) => d.uuid === datapoint.uuid)).to.equal(datapoint);
      });

      it('should add the datapoint to the subpillar', () => {
        const newModel = baseModel.addDatapointTo(
          pillarFilter(pillarFilter(baseModel, es.name), esNbs.name),
          datapoint
        );
        const newPillar = pillarFilter(pillarFilter(newModel, es.name), esNbs.name);
        expect(newModel).to.not.equal(baseModel);
        expect(newPillar.datapoints.size).to.equal(1);
        expect(newPillar.datapoints.find((d) => d.uuid === datapoint.uuid)).to.equal(datapoint);
      });
    });
  });

  describe('modifying datapoints', () => {
    const datapoint1 = createDatapoint({
      code: 'datapoint1',
      name: 'datapoint 1',
      weight: 60,
    });
    const datapoint2 = createDatapoint({
      code: 'datapoint2',
      name: 'datapoint 2',
      weight: 23,
    });
    const datapoint3 = createDatapoint({
      code: 'datapoint3',
      name: 'datapoint 3',
      weight: 17,
    });

    describe('at model level', () => {
      const newModel = baseModel
        .addDatapointTo(null, datapoint1)
        .addDatapointTo(null, datapoint2)
        .addDatapointTo(null, datapoint3);

      it('should remove the datapoint and redistribute weights', () => {
        const model = newModel.removeDatapointFrom(null, datapoint2);
        expect(model).to.not.equal(newModel);
        expect(model.datapoints.find((d) => d.uuid === datapoint2.uuid)).to.be.undefined;
        expect(model.datapoints.find((d) => d.uuid === datapoint1.uuid).weight).to.equal(77);
        expect(model.datapoints.find((d) => d.uuid === datapoint3.uuid).weight).to.equal(23);
      });

      it('should remove the datapoint even when a pillar is specified that the model does not own', () => {
        const model = newModel.removeDatapointFrom(esNbsOther, datapoint2);
        expect(model).to.not.equal(newModel);
        expect(model.datapoints.find((d) => d.uuid === datapoint2.uuid)).to.be.undefined;
      });
    });

    describe('at pillar level', () => {
      const datapoint4 = createDatapoint({
        code: 'datapoint4',
        name: 'datapoint 4',
        weight: 15,
      });
      const datapoint5 = createDatapoint({
        code: 'datapoint5',
        name: 'datapoint 5',
        weight: 25,
      });
      const datapoint6 = createDatapoint({
        code: 'datapoint6',
        name: 'datapoint 6',
        weight: 60,
      });
      const subPillar = new Pillar({ name: 'subpillar', weight: 100.0 })
        .addDatapointTo(null, datapoint4)
        .addDatapointTo(null, datapoint5)
        .addDatapointTo(null, datapoint6);
      const pillar = new Pillar({ name: 'pillar', weight: 0.0 })
        .addDatapointTo(null, datapoint1)
        .addDatapointTo(null, datapoint2)
        .addDatapointTo(null, datapoint3)
        .addPillar(subPillar);
      const newModel = baseModel.addPillar({ pillar });

      it('should remove the datapoint from the pillar', () => {
        const model = newModel.removeDatapointFrom(pillarFilter(newModel, pillar.name), datapoint2);
        const newPillar = pillarFilter(model, pillar.name);
        expect(model).to.not.equal(newModel);
        expect(newPillar.datapoints.size).to.equal(2);
        expect(newPillar.datapoints.find((d) => d.uuid === datapoint2.uuid)).to.be.undefined;
      });

      it('should remove the datapoint from the subpillar', () => {
        const model = newModel.removeDatapointFrom(
          pillarFilter(pillarFilter(newModel, pillar.name), subPillar.name),
          datapoint6
        );
        const newPillar = pillarFilter(pillarFilter(model, pillar.name), subPillar.name);
        expect(model).to.not.equal(newModel);
        expect(newPillar.datapoints.size).to.equal(2);
        expect(newPillar.datapoints.find((d) => d.uuid === datapoint6.uuid)).to.be.undefined;
      });

      describe('weight redistribution', () => {
        describe('with unlocked datapoints', () => {
          it('should update all other datapoint weights in pillar', () => {
            const model = newModel.updateDatapointWeight(datapoint2, pillarFilter(newModel, pillar.name), 30);
            const newPillar = pillarFilter(model, pillar.name);
            expect(model).to.not.equal(newModel);
            expect(newPillar.datapoints.size).to.equal(3);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint2.uuid)).to.not.be.undefined;
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint1.uuid).weight).to.equal(54);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint2.uuid).weight).to.equal(30);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint3.uuid).weight).to.equal(16);
          });

          it('should update all other datapoint weights in subPillar', () => {
            const model = newModel.updateDatapointWeight(
              datapoint4,
              pillarFilter(pillarFilter(newModel, pillar.name), subPillar.name),
              76
            );
            const newPillar = pillarFilter(pillarFilter(model, pillar.name), subPillar.name);
            expect(model).to.not.equal(newModel);
            expect(newPillar.datapoints.size).to.equal(3);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint4.uuid)).to.not.be.undefined;
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint4.uuid).weight).to.equal(76);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint5.uuid).weight).to.equal(8);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint6.uuid).weight).to.equal(16);
          });
        });

        describe('with locked datapoints', () => {
          // lockDatapointWeight(datapoint, pillar)
          it('should update all other unlocked datapoint weights in pillar', () => {
            let model = newModel.lockDatapointWeight(datapoint1, pillarFilter(newModel, pillar.name));
            model = model.updateDatapointWeight(datapoint3, pillarFilter(model, pillar.name), 30);
            const newPillar = pillarFilter(model, pillar.name);
            expect(model).to.not.equal(newModel);
            expect(newPillar.datapoints.size).to.equal(3);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint1.uuid).weight).to.equal(60);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint2.uuid).weight).to.equal(10);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint3.uuid).weight).to.equal(30);
          });

          it('should update all other unlocked datapoint weights in subPillar', () => {
            let model = newModel.lockDatapointWeight(
              datapoint5,
              pillarFilter(pillarFilter(newModel, pillar.name), subPillar.name)
            );
            model = model.updateDatapointWeight(
              datapoint6,
              pillarFilter(pillarFilter(model, pillar.name), subPillar.name),
              38
            );
            const newPillar = pillarFilter(pillarFilter(model, pillar.name), subPillar.name);
            expect(model).to.not.equal(newModel);
            expect(newPillar.datapoints.size).to.equal(3);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint4.uuid).weight).to.equal(37);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint5.uuid).weight).to.equal(25);
            expect(newPillar.datapoints.find((d) => d.uuid === datapoint6.uuid).weight).to.equal(38);
          });
        });
      });
    });
  });
});
