world_cup = Tournament.find_by!(
  name: "FIFA World Cup 2026"
)

eastern = ActiveSupport::TimeZone["Eastern Time (US & Canada)"]

def team(code)
  Team.find_by!(code: code)
end

def group(world_cup, name)
  Group.find_by!(
    tournament: world_cup,
    name: name
  )
end

matches = [
  {
    group: "A",
    home: "MEX",
    away: "RSA",
    kickoff_at: "2026-06-11 15:00",
    stadium: "Estadio Ciudad de México"
  },
  {
    group: "A",
    home: "KOR",
    away: "CZE",
    kickoff_at: "2026-06-11 22:00",
    stadium: "Estadio Guadalajara"
  },
  {
    group: "B",
    home: "CAN",
    away: "BIH",
    kickoff_at: "2026-06-12 15:00",
    stadium: "Estadio Toronto"
  },
  {
    group: "D",
    home: "USA",
    away: "PAR",
    kickoff_at: "2026-06-12 21:00",
    stadium: "Estadio Los Ángeles"
  }
]

matches.each do |data|
  Match.find_or_create_by!(
    tournament: world_cup,
    home_team: team(data[:home]),
    away_team: team(data[:away]),
    kickoff_at: eastern.parse(data[:kickoff_at])
  ) do |match|
    match.group = group(world_cup, data[:group])
    match.stage = :group_stage
    match.stadium = data[:stadium]
  end
end

puts "Created #{Match.count} matches"