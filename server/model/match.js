class Match {
  constructor(
    matchKey,
    matchTime,
    matchType,
    matchNumber,
    setNumber,
    redAlliance,
    blueAlliance
  ) {
    this.matchKey = matchKey;
    this.matchTime = matchTime;
    this.matchType = matchType;
    this.matchNumber = matchNumber;
    this.setNumber = setNumber;
    this.redAlliance = redAlliance;
    this.blueAlliance = blueAlliance;
  }

  isTeamOnRed(teamNumber) {
    return this.redAlliance.teams.includes(`frc${teamNumber}`);
  }

  isTeamOnBlue(teamNumber) {
    return this.blueAlliance.teams.includes(`frc${teamNumber}`);
  }

  getMatchDescriptor() {
    if (this.matchType === "f") {
      return `Finals Match: ${this.matchNumber}:`;
    } else if (this.matchType === "sf") {
      return `Semifinals Set: ${
        this.setNumber + " Match: " + this.matchNumber
      }:`;
    } else {
      return `Match: ${this.matchNumber}:`;
    }
  }
}

module.exports = Match;
