/**
 * Disaster Hospital Surge & Critical Care Triage Evaluator.
 * Models incoming emergency casualty influx against staffed ICU bed capacity.
 */
export class HospitalSurgeEvaluator {
  constructor({ staffedBeds = 200, icuBeds = 40, baselineOccupancyPct = 80.0 } = {}) {
    this.staffedBeds = staffedBeds;
    this.icuBeds = icuBeds;
    this.currentGeneralOccupied = Math.round(staffedBeds * (baselineOccupancyPct / 100));
    this.currentIcuOccupied = Math.round(icuBeds * (baselineOccupancyPct / 100));
  }

  processSurgeArrivals(incomingPatients) {
    let admittedGeneral = 0;
    let admittedIcu = 0;
    let diverted = 0;

    for (const patient of incomingPatients) {
      if (patient.acuity === 'CRITICAL_ICU') {
        if (this.currentIcuOccupied < this.icuBeds) {
          this.currentIcuOccupied += 1;
          admittedIcu += 1;
        } else if (this.currentGeneralOccupied < this.staffedBeds) {
          this.currentGeneralOccupied += 1;
          admittedGeneral += 1; // Surge stepdown
        } else {
          diverted += 1;
        }
      } else {
        if (this.currentGeneralOccupied < this.staffedBeds) {
          this.currentGeneralOccupied += 1;
          admittedGeneral += 1;
        } else {
          diverted += 1;
        }
      }
    }

    const generalUtilization = (this.currentGeneralOccupied / this.staffedBeds) * 100;
    const icuUtilization = (this.currentIcuOccupied / this.icuBeds) * 100;

    return {
      admittedGeneral,
      admittedIcu,
      diverted,
      generalUtilizationPct: Number(generalUtilization.toFixed(1)),
      icuUtilizationPct: Number(icuUtilization.toFixed(1)),
      divertDirectiveActive: diverted > 0 || generalUtilization >= 100.0,
    };
  }
}
