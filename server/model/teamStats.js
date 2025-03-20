class TeamStats {
  constructor(rank, wins, losses, otherStats) {
    this.rank = rank;
    this.wins = wins;
    this.losses = losses;
    // otherStats is an array of objects: { name, value, precision }
    this.otherStats = otherStats;
  }
}

module.exports = TeamStats;