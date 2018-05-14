const expect = require('chai').expect;

import Datapoint, { createDatapoint } from 'iss/CustomScoring/react/models/Datapoint.jsx';
import Pillar, { createPillar } from 'iss/CustomScoring/react/models/Pillar.jsx';
import uuidv4 from 'uuid/v4';

describe('Pillar', () => {
  const esWeapons = new Pillar({ name: 'Weapons', weight: 50 })
    .addDatapoint(createDatapoint({ name: 'BiologicalWeaponsOverallFlag', weight: 20 }))
    .addDatapoint(createDatapoint({ name: 'DepletedUraniumTotalAmbers', weight: 80 }));
  const esNbsOther = new Pillar({ name: 'Other', weight: 100 })
    .addDatapoint(createDatapoint({ name: 'NBSOverallScore', weight: 10 }))
    .addDatapoint(createDatapoint({ name: 'NBSTotalAmbers', weight: 90 }));
  const esNbs = new Pillar({ name: 'NBS', weight: 50 }).addPillar(esNbsOther);
  const es = new Pillar({ name: 'ES', weight: 20 }).addPillar(esWeapons).addPillar(esNbs);

  const govBoardDirectorPay = new Pillar({ name: 'Director Pay', weight: 70 })
    .addDatapoint(createDatapoint({ name: 'AvgDirectorCompTotalUSD', weight: 10 }))
    .addDatapoint(createDatapoint({ name: 'AnnualRetainerFeeTotalUSD', weight: 90 }));
  const govBoard = new Pillar({ name: 'Board', weight: 30 })
    .addPillar(govBoardDirectorPay)
    .addDatapoint(createDatapoint({ name: 'BoardIndependenceRatioPAS', weight: 20 }))
    .addDatapoint(createDatapoint({ name: 'AvgDirectorAge', weight: 10 }));
  const governance = new Pillar({ name: 'Governance', weight: 60 }).addPillar(govBoard);

  const other = new Pillar({ name: 'Other', weight: 20 }).addDatapoint(
    createDatapoint({ name: 'BoardSize', weight: 100 })
  );

  const pillarFinder = (pillars, name) => pillars.find((e) => e.name === name);

  describe('defaults', () => {
    it('requires a name', () => {
      try {
        new Pillar();
      } catch (e) {
        expect(e.message).to.equal('Pillars are required to have a "name"');
      }
    });

    it('creates uuid when it is not present', () => {
      const pillar = new Pillar({ name: 'foo' });
      expect(pillar.uuid).to.not.be.undefined;
    });

    it('takes the name given to it', () => {
      const pillar = new Pillar({ name: 'Bar Blat' });
      expect(pillar.name).to.equal('Bar Blat');
    });

    it('creates a path based on the name', () => {
      const pillar = new Pillar({ name: 'Bar Blat ... Stuff!!!@' });
      expect(pillar.path).to.equal('bar-blat-stuff');
    });

    it('creates empty pillars collection', () => {
      const pillar = new Pillar({ name: 'umm' });
      expect(pillar.pillars).to.not.be.undefined;
      expect(pillar.pillars.size).to.equal(0);
    });

    it('creates empty datapoints collection', () => {
      const pillar = new Pillar({ name: 'aww-yeah' });
      expect(pillar.datapoints).to.not.be.undefined;
      expect(pillar.datapoints.size).to.equal(0);
    });

    it("doesn't default weight", () => {
      const pillar = new Pillar({ name: 'foo' });
      expect(pillar.weight).to.be.undefined;
    });

    it('does not replace uuid when it is present', () => {
      const uuid = uuidv4();
      const pillar = new Pillar({ name: 'foo', uuid: uuid });
      expect(pillar.uuid).to.equal(uuid);
    });

    describe('levels', () => {
      const json = {
        name: 'top',
        pillars: [
          {
            name: 'sub-1',
            pillars: [
              {
                name: 'sub-sub-1',
                pillars: [{ name: 'sub-sub-sub-1' }, { name: 'sub-sub-sub-2' }],
              },
              {
                name: 'sub-sub-2',
              },
            ],
          },
          {
            name: 'sub-2',
          },
        ],
      };
      const pillar = createPillar(json);
      it('sets the pillar level to 1', () => {
        expect(pillar.level).to.equal(1);
      });

      it('calculates subpillar levels', () => {
        pillar.pillars.forEach((p) => expect(p.level).to.equal(2));
      });
    });
  });

  describe('findParentageOf', () => {
    const board = pillarFinder(governance.pillars, 'Board');
    const dirPay = pillarFinder(board.pillars, 'Director Pay');
    const parents = governance.findParentageOf(dirPay);

    it('finds right count of parents of a deeply nested pillar', () => {
      expect(parents.size).to.equal(3);
    });

    it('includes all parents of a deeply nested pillar', () => {
      expect(parents.get(2)).to.equal(dirPay);
      expect(parents.get(1)).to.equal(board);
      expect(parents.get(0)).to.equal(governance);
    });
  });

  describe('paths', () => {
    it("doesn't change the path or the instance", () => {
      const pillar = new Pillar({ name: 'Bar Blat', path: 'foo.bar-blat' });
      expect(pillar.prependPath('foo')).to.equal(pillar);
    });
  });

  describe('updating', () => {
    describe('my name', () => {
      const subSubPillar = (top, name) => pillarFinder(pillarFinder(top.pillars, 'Board').pillars, name);
      const original = subSubPillar(governance, 'Director Pay');
      const updatedGov = governance.updateNameInTree(original, 'Dir. Pay');
      const updated = subSubPillar(updatedGov, 'Dir. Pay');

      it('creates a new instance', () => {
        expect(updated).to.not.equal(original);
      });
      it('sets name to new value', () => {
        expect(updated.name).to.equal('Dir. Pay');
      });
      it('sets path according to new name', () => {
        expect(updated.path).to.equal('governance.board.dir-pay');
      });
    });

    describe('my weight', () => {
      const updated = other.updateWeightInTree(other, 0.1);
      it('creates a new instance', () => {
        expect(updated).to.not.equal(other);
      });
      it('sets weight to new value', () => {
        expect(updated.weight).to.equal(0.1);
      });
    });

    describe('subpillar name', () => {
      const subSubPillar = (top, name) => pillarFinder(pillarFinder(top.pillars, 'NBS').pillars, name);
      const updated = es.updateNameInTree(subSubPillar(es, 'Other'), 'bazblat');

      it('creates a new instance', () => {
        expect(updated.name).to.equal('ES');
        expect(updated).to.not.equal(es);
      });
      it('sets name to new value', () => {
        const newPillar = subSubPillar(updated, 'bazblat');
        expect(newPillar).to.not.be.undefined;
        expect(newPillar.name).to.equal('bazblat');
      });
    });

    describe('subpillar weight', () => {
      const findWeapons = (top) => pillarFinder(top.pillars, 'Weapons');
      const updated = es.updateWeightInTree(findWeapons(es), 0.49);

      it('creates a new instance', () => {
        expect(updated.name).to.equal('ES');
        expect(updated).to.not.equal(es);
      });
      it('sets weight to new value', () => {
        const newPillar = findWeapons(updated);
        expect(newPillar).to.not.be.undefined;
        expect(newPillar.weight).to.equal(0.49);
      });
    });
  });

  describe('weight', () => {
    describe('#totalWeight', () => {
      it('should be 100.0', () => {
        expect(govBoard.totalWeight()).to.equal(100.0);
      });

      describe('redistribution', () => {
        it('should redistribute weights after editing a single weight', () => {
          const pillar = new Pillar({ name: 'parent', weight: 100 })
            .addPillar(new Pillar({ name: 'child1', weight: 33 }))
            .addPillar(new Pillar({ name: 'child2', weight: 33 }))
            .addPillar(new Pillar({ name: 'child3', weight: 34 }));
          const newPillar = pillar.updatePillarWeight(pillarFinder(pillar.pillars, 'child2'), 60);
          expect(newPillar.totalWeight()).to.equal(100.0);
          expect(pillarFinder(newPillar.pillars, 'child1').weight).to.equal(19);
          expect(pillarFinder(newPillar.pillars, 'child2').weight).to.equal(60);
          expect(pillarFinder(newPillar.pillars, 'child3').weight).to.equal(21);
        });

        it('should redistribute unlocked weights only', () => {
          const pillar = new Pillar({ name: 'parent', weight: 100 })
            .addPillar(new Pillar({ name: 'child1', weight: 20, isLocked: true }))
            .addPillar(new Pillar({ name: 'child2', weight: 30 }))
            .addPillar(new Pillar({ name: 'child3', weight: 15 }))
            .addPillar(new Pillar({ name: 'child4', weight: 35 }));
          const newPillar = pillar.updatePillarWeight(pillarFinder(pillar.pillars, 'child4'), 60);
          expect(newPillar.totalWeight()).to.equal(100.0);
          expect(pillarFinder(newPillar.pillars, 'child1').weight).to.equal(20); // locked
          expect(pillarFinder(newPillar.pillars, 'child2').weight).to.equal(14);
          expect(pillarFinder(newPillar.pillars, 'child3').weight).to.equal(6);
          expect(pillarFinder(newPillar.pillars, 'child4').weight).to.equal(60);
        });

        it ('should redistribute weights after removing a pillar', () => {
          let pillar = new Pillar({ name: 'parent', weight: 100 })
            .addPillar(new Pillar({ name: 'child1', weight: 33 }))
            .addPillar(new Pillar({ name: 'child2', weight: 33 }))
            .addPillar(new Pillar({ name: 'child3', weight: 34 }));

          let removedPillar = pillarFinder(pillar.pillars, 'child2');
          pillar = pillar.removePillar(removedPillar);
          expect(pillarFinder(pillar.pillars, 'child1').weight).to.equal(50);
          expect(pillarFinder(pillar.pillars, 'child3').weight).to.equal(50);
        });

        it('should redistribute weights in subpillars', () => {
          const pillar = new Pillar({ name: 'parent', weight: 100 })
            .addPillar(new Pillar({ name: 'child1', weight: 50 }))
            .addPillar(
              new Pillar({ name: 'child2', weight: 50 })
                .addPillar(new Pillar({ name: 'child2-1', weight: 25 }))
                .addPillar(new Pillar({ name: 'child2-2', weight: 25 }))
                .addPillar(new Pillar({ name: 'child2-3', weight: 25 }))
                .addPillar(new Pillar({ name: 'child2-4', weight: 25 }))
            );
          const subPillarFinder = (pillar, name) => pillar.allPillarsFlattened().find((v) => v.name === name);
          const newPillar = pillar.updatePillarWeight(subPillarFinder(pillar, 'child2-4'), 40);
          expect(newPillar.totalWeight()).to.equal(100.0);
          expect(subPillarFinder(newPillar, 'child2-1').weight).to.equal(20);
          expect(subPillarFinder(newPillar, 'child2-2').weight).to.equal(20);
          expect(subPillarFinder(newPillar, 'child2-3').weight).to.equal(20);
          expect(subPillarFinder(newPillar, 'child2-4').weight).to.equal(40);
        });
      });
    });

    describe('#totalWeightFormatted', () => {
      it('should be 100.00%', () => {
        expect(govBoard.totalWeightFormatted()).to.equal('100.00%');
      });
    });
  });
});
