class TeamStats {
  constructor(
    rank,
    avgRankingScore,
    wins,
    losses,
    avgMatchScore,
    avgCoopertitionScore,
    avgAutoScore,
    avgStageScore
  ) {
    this.rank = rank;
    this.avgRankingScore = avgRankingScore;
    this.wins = wins;
    this.losses = losses;
    this.avgMatchScore = avgMatchScore;
    this.avgCoopertitionScore = avgCoopertitionScore;
    this.avgAutoScore = avgAutoScore;
    this.avgStageScore = avgStageScore;
  }
}

module.exports = TeamStats;
