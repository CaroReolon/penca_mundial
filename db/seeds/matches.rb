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
  # ---------------- A ----------------
  {
    group: "A",
    home: "MEX",
    away: "RSA",
    kickoff_at: "2026-06-11 15:00",
    stadium: "Estadio Ciudad de México",
    stadium_en: "Mexico City Stadium"
  },
  {
    group: "A",
    home: "KOR",
    away: "CZE",
    kickoff_at: "2026-06-11 22:00",
    stadium: "Estadio Guadalajara",
    stadium_en: "Guadalajara Stadium"
  },
  {
    group: "A",
    home: "RSA",
    away: "CZE",
    kickoff_at: "2026-06-18 12:00",
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    group: "A",
    home: "MEX",
    away: "KOR",
    kickoff_at: "2026-06-18 21:00",
    stadium: "Estadio Guadalajara",
    stadium_en: "Guadalajara Stadium"
  },

  # ---------------- B ----------------
  {
    group: "B",
    home: "CAN",
    away: "BIH",
    kickoff_at: "2026-06-12 15:00",
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },
  {
    group: "B",
    home: "QAT",
    away: "SUI",
    kickoff_at: "2026-06-13 15:00",
    stadium: "Estadio Bahía de San Francisco",
    stadium_en: "San Francisco Bay Stadium"
  },
  {
    group: "B",
    home: "SUI",
    away: "BIH",
    kickoff_at: "2026-06-18 15:00",
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    group: "B",
    home: "CAN",
    away: "QAT",
    kickoff_at: "2026-06-18 18:00",
    stadium: "Estadio Vancouver",
    stadium_en: "Vancouver Stadium"
  },

  # ---------------- C ----------------
  {
    group: "C",
    home: "BRA",
    away: "MAR",
    kickoff_at: "2026-06-13 18:00",
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },
  {
    group: "C",
    home: "HAI",
    away: "SCO",
    kickoff_at: "2026-06-13 21:00",
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },
  {
    group: "C",
    home: "SCO",
    away: "MAR",
    kickoff_at: "2026-06-19 18:00",
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },
  {
    group: "C",
    home: "BRA",
    away: "HAI",
    kickoff_at: "2026-06-19 21:00",
    stadium: "Estadio Filadelfia",
    stadium_en: "Philadelphia Stadium"
  },

  # ---------------- D ----------------
  {
    group: "D",
    home: "USA",
    away: "PAR",
    kickoff_at: "2026-06-12 21:00",
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    group: "D",
    home: "AUS",
    away: "TUR",
    kickoff_at: "2026-06-13 00:00",
    stadium: "Estadio Vancouver",
    stadium_en: "Vancouver Stadium"
  },
  {
    group: "D",
    home: "USA",
    away: "AUS",
    kickoff_at: "2026-06-19 15:00",
    stadium: "Estadio Seattle",
    stadium_en: "Seattle Stadium"
  },
  {
    group: "D",
    home: "TUR",
    away: "PAR",
    kickoff_at: "2026-06-19 00:00",
    stadium: "Estadio Bahía de San Francisco",
    stadium_en: "San Francisco Bay Stadium"
  },

  # ---------------- E ----------------
  {
    group: "E",
    home: "GER",
    away: "CUW",
    kickoff_at: "2026-06-14 13:00",
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },
  {
    group: "E",
    home: "CIV",
    away: "ECU",
    kickoff_at: "2026-06-14 19:00",
    stadium: "Estadio Filadelfia",
    stadium_en: "Philadelphia Stadium"
  },
  {
    group: "E",
    home: "GER",
    away: "CIV",
    kickoff_at: "2026-06-20 16:00",
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },
  {
    group: "E",
    home: "ECU",
    away: "CUW",
    kickoff_at: "2026-06-20 22:00",
    stadium: "Estadio Kansas City",
    stadium_en: "Kansas City Stadium"
  },

  # ---------------- F ----------------
  {
    group: "F",
    home: "NED",
    away: "JPN",
    kickoff_at: "2026-06-14 16:00",
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  },
  {
    group: "F",
    home: "SWE",
    away: "TUN",
    kickoff_at: "2026-06-14 22:00",
    stadium: "Estadio Monterrey",
    stadium_en: "Monterrey Stadium"
  },
  {
    group: "F",
    home: "NED",
    away: "SWE",
    kickoff_at: "2026-06-20 13:00",
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },
  {
    group: "F",
    home: "JPN",
    away: "TUN",
    kickoff_at: "2026-06-20 00:00",
    stadium: "Estadio Monterrey",
    stadium_en: "Monterrey Stadium"
  },

  # ---------------- G ----------------
  {
    group: "G",
    home: "BEL",
    away: "EGY",
    kickoff_at: "2026-06-15 15:00",
    stadium: "Estadio Seattle",
    stadium_en: "Seattle Stadium"
  },
  {
    group: "G",
    home: "IRN",
    away: "NZL",
    kickoff_at: "2026-06-15 21:00",
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    group: "G",
    home: "BEL",
    away: "IRN",
    kickoff_at: "2026-06-21 15:00",
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    group: "G",
    home: "NZL",
    away: "EGY",
    kickoff_at: "2026-06-21 21:00",
    stadium: "Estadio Vancouver",
    stadium_en: "Vancouver Stadium"
  },

  # ---------------- H ----------------
  {
    group: "H",
    home: "ESP",
    away: "CPV",
    kickoff_at: "2026-06-15 12:00",
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    group: "H",
    home: "KSA",
    away: "URU",
    kickoff_at: "2026-06-15 18:00",
    stadium: "Estadio Miami",
    stadium_en: "Miami Stadium"
  },
  {
    group: "H",
    home: "ESP",
    away: "KSA",
    kickoff_at: "2026-06-21 12:00",
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    group: "H",
    home: "URU",
    away: "CPV",
    kickoff_at: "2026-06-21 18:00",
    stadium: "Estadio Miami",
    stadium_en: "Miami Stadium"
  },

  # ---------------- I ----------------
  {
    group: "I",
    home: "FRA",
    away: "SEN",
    kickoff_at: "2026-06-16 15:00",
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },
  {
    group: "I",
    home: "IRQ",
    away: "NOR",
    kickoff_at: "2026-06-16 18:00",
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },
  {
    group: "I",
    home: "FRA",
    away: "IRQ",
    kickoff_at: "2026-06-22 17:00",
    stadium: "Estadio Filadelfia",
    stadium_en: "Philadelphia Stadium"
  },
  {
    group: "I",
    home: "NOR",
    away: "SEN",
    kickoff_at: "2026-06-22 20:00",
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },

  # ---------------- J ----------------
  {
    group: "J",
    home: "ARG",
    away: "ALG",
    kickoff_at: "2026-06-16 21:00",
    stadium: "Estadio Kansas City",
    stadium_en: "Kansas City Stadium"
  },
  {
    group: "J",
    home: "AUT",
    away: "JOR",
    kickoff_at: "2026-06-16 00:00",
    stadium: "Estadio Bahía de San Francisco",
    stadium_en: "San Francisco Bay Stadium"
  },
  {
    group: "J",
    home: "ARG",
    away: "AUT",
    kickoff_at: "2026-06-22 13:00",
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  },
  {
    group: "J",
    home: "JOR",
    away: "ALG",
    kickoff_at: "2026-06-22 23:00",
    stadium: "Estadio Bahía de San Francisco",
    stadium_en: "San Francisco Bay Stadium"
  },

  # ---------------- K ----------------
  {
    group: "K",
    home: "POR",
    away: "COD",
    kickoff_at: "2026-06-17 13:00",
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },
  {
    group: "K",
    home: "UZB",
    away: "COL",
    kickoff_at: "2026-06-17 22:00",
    stadium: "Estadio Ciudad de México",
    stadium_en: "Mexico City Stadium"
  },
  {
    group: "K",
    home: "POR",
    away: "UZB",
    kickoff_at: "2026-06-23 13:00",
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },
  {
    group: "K",
    home: "COL",
    away: "COD",
    kickoff_at: "2026-06-23 22:00",
    stadium: "Estadio Guadalajara",
    stadium_en: "Guadalajara Stadium"
  },

  # ---------------- L ----------------
  {
    group: "L",
    home: "ENG",
    away: "CRO",
    kickoff_at: "2026-06-17 16:00",
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  },
  {
    group: "L",
    home: "GHA",
    away: "PAN",
    kickoff_at: "2026-06-17 19:00",
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },
  {
    group: "L",
    home: "ENG",
    away: "GHA",
    kickoff_at: "2026-06-23 16:00",
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },
  {
    group: "L",
    home: "PAN",
    away: "CRO",
    kickoff_at: "2026-06-23 19:00",
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },

  # ---------------- 24 JUN ----------------
  {
    group: "B",
    home: "SUI",
    away: "CAN",
    kickoff_at: "2026-06-24 15:00",
    stadium: "BC Place Vancouver",
    stadium_en: "BC Place Vancouver"
  },
  {
    group: "B",
    home: "BIH",
    away: "QAT",
    kickoff_at: "2026-06-24 15:00",
    stadium: "Estadio Seattle",
    stadium_en: "Seattle Stadium"
  },
  {
    group: "C",
    home: "SCO",
    away: "BRA",
    kickoff_at: "2026-06-24 18:00",
    stadium: "Estadio Miami",
    stadium_en: "Miami Stadium"
  },
  {
    group: "C",
    home: "MAR",
    away: "HAI",
    kickoff_at: "2026-06-24 18:00",
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    group: "A",
    home: "CZE",
    away: "MEX",
    kickoff_at: "2026-06-24 21:00",
    stadium: "Estadio Ciudad de México",
    stadium_en: "Mexico City Stadium"
  },
  {
    group: "A",
    home: "RSA",
    away: "KOR",
    kickoff_at: "2026-06-24 21:00",
    stadium: "Estadio Monterrey",
    stadium_en: "Monterrey Stadium"
  },

  # ---------------- 25 JUN ----------------
  {
    group: "E",
    home: "CUW",
    away: "CIV",
    kickoff_at: "2026-06-25 16:00",
    stadium: "Estadio Filadelfia",
    stadium_en: "Philadelphia Stadium"
  },
  {
    group: "E",
    home: "ECU",
    away: "GER",
    kickoff_at: "2026-06-25 16:00",
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },
  {
    group: "F",
    home: "JPN",
    away: "SWE",
    kickoff_at: "2026-06-25 19:00",
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  },
  {
    group: "F",
    home: "TUN",
    away: "NED",
    kickoff_at: "2026-06-25 19:00",
    stadium: "Estadio Kansas City",
    stadium_en: "Kansas City Stadium"
  },
  {
    group: "D",
    home: "TUR",
    away: "USA",
    kickoff_at: "2026-06-25 22:00",
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    group: "D",
    home: "PAR",
    away: "AUS",
    kickoff_at: "2026-06-25 22:00",
    stadium: "Estadio Bahía de San Francisco",
    stadium_en: "San Francisco Bay Stadium"
  },

  # ---------------- 26 JUN ----------------
  {
    group: "I",
    home: "NOR",
    away: "FRA",
    kickoff_at: "2026-06-26 15:00",
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },
  {
    group: "I",
    home: "SEN",
    away: "IRQ",
    kickoff_at: "2026-06-26 15:00",
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },
  {
    group: "H",
    home: "CPV",
    away: "KSA",
    kickoff_at: "2026-06-26 20:00",
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },
  {
    group: "H",
    home: "URU",
    away: "ESP",
    kickoff_at: "2026-06-26 20:00",
    stadium: "Estadio Guadalajara",
    stadium_en: "Guadalajara Stadium"
  },
  {
    group: "G",
    home: "EGY",
    away: "IRN",
    kickoff_at: "2026-06-26 23:00",
    stadium: "Estadio Seattle",
    stadium_en: "Seattle Stadium"
  },
  {
    group: "G",
    home: "NZL",
    away: "BEL",
    kickoff_at: "2026-06-26 23:00",
    stadium: "BC Place Vancouver",
    stadium_en: "BC Place Vancouver"
  },

  # ---------------- 27 JUN ----------------
  {
    group: "L",
    home: "PAN",
    away: "ENG",
    kickoff_at: "2026-06-27 17:00",
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },
  {
    group: "L",
    home: "CRO",
    away: "GHA",
    kickoff_at: "2026-06-27 17:00",
    stadium: "Estadio Filadelfia",
    stadium_en: "Philadelphia Stadium"
  },
  {
    group: "K",
    home: "COL",
    away: "POR",
    kickoff_at: "2026-06-27 19:30",
    stadium: "Estadio Miami",
    stadium_en: "Miami Stadium"
  },
  {
    group: "K",
    home: "COD",
    away: "UZB",
    kickoff_at: "2026-06-27 19:30",
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    group: "J",
    home: "ALG",
    away: "AUT",
    kickoff_at: "2026-06-27 22:00",
    stadium: "Estadio Kansas City",
    stadium_en: "Kansas City Stadium"
  },
  {
    group: "J",
    home: "JOR",
    away: "ARG",
    kickoff_at: "2026-06-27 22:00",
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  }
]

matches.each do |data|
  Match.find_or_create_by!(
    tournament: world_cup,
    home_team: team(data[:home]),
    away_team: team(data[:away]),
    kickoff_at: eastern.parse(data[:kickoff_at])
  ) do |match|
    match.group   = group(world_cup, data[:group])
    match.stage   = :group_stage
    match.stadium = data[:stadium]
    match.completed = false
  end
end

puts "Created #{Match.count} matches"