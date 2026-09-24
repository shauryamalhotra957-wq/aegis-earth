import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { HospitalSurgeEvaluator } from '../src/utils/hospital_surge.js';

describe('HospitalSurgeEvaluator Test Suite', () => {
  test('admits patients within open bed capacity', () => {
    // 100 general (80 occupied -> 20 free), 20 ICU (16 occupied -> 4 free)
    const evaluator = new HospitalSurgeEvaluator({ staffedBeds: 100, icuBeds: 20, baselineOccupancyPct: 80.0 });
    const arrivals = [
      { id: 'p1', acuity: 'CRITICAL_ICU' },
      { id: 'p2', acuity: 'CRITICAL_ICU' },
      { id: 'p3', acuity: 'MODERATE' },
    ];
    const res = evaluator.processSurgeArrivals(arrivals);
    assert.strictEqual(res.admittedIcu, 2);
    assert.strictEqual(res.admittedGeneral, 1);
    assert.strictEqual(res.diverted, 0);
    assert.strictEqual(res.divertDirectiveActive, false);
  });

  test('triggers divert directive when capacity saturated', () => {
    // 10 beds, 9 occupied -> 1 free
    const evaluator = new HospitalSurgeEvaluator({ staffedBeds: 10, icuBeds: 2, baselineOccupancyPct: 90.0 });
    const arrivals = [
      { id: 'p1', acuity: 'MODERATE' },
      { id: 'p2', acuity: 'MODERATE' },
      { id: 'p3', acuity: 'MODERATE' },
    ];
    const res = evaluator.processSurgeArrivals(arrivals);
    assert.strictEqual(res.admittedGeneral, 1);
    assert.strictEqual(res.diverted, 2);
    assert.strictEqual(res.divertDirectiveActive, true);
  });
});
