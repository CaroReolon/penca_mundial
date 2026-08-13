# Extra PENDING matches across every stage, meant only to make the app look
# good for screenshots (dashboard, predictions, admin panel, etc).
#
# Run it on demand, it is NOT loaded by db/seeds.rb:
#   rails runner db/seeds/screenshot_demo.rb
#
# All kickoff times are relative to "now", so matches always show up as
# upcoming/pending no matter when you run this.

world_cup = Tournament.find_by!(name: "FIFA World Cup 2026")

def team(code)
  Team.find_by!(code: code)
end

def group(world_cup, name)
  Group.find_by!(tournament: world_cup, name: name)
end

now = Time.current

demo_matches = [
  # ---------------- Group stage (fresh pending fixtures) ----------------
  {
    group: "J",
    home: "ARG",
    away: "ALG",
    stage: :group_stage,
    kickoff_at: now + 1.day + 15.hours,
    stadium: "Estadio Kansas City",
    stadium_en: "Kansas City Stadium"
  },
  {
    group: "C",
    home: "BRA",
    away: "MAR",
    stage: :group_stage,
    kickoff_at: now + 1.day + 18.hours,
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  },

  # ---------------- Round of 32 ----------------
  {
    home: "ARG",
    away: "URU",
    stage: :round_of_32,
    kickoff_at: now + 3.days + 15.hours,
    stadium: "Estadio Los Ángeles",
    stadium_en: "Los Angeles Stadium"
  },
  {
    home: "BRA",
    away: "POR",
    stage: :round_of_32,
    kickoff_at: now + 3.days + 19.hours,
    stadium: "Estadio Miami",
    stadium_en: "Miami Stadium"
  },

  # ---------------- Round of 16 ----------------
  {
    home: "FRA",
    away: "ESP",
    stage: :round_of_16,
    kickoff_at: now + 5.days + 15.hours,
    stadium: "Estadio Atlanta",
    stadium_en: "Atlanta Stadium"
  },
  {
    home: "GER",
    away: "ENG",
    stage: :round_of_16,
    kickoff_at: now + 5.days + 19.hours,
    stadium: "Estadio Houston",
    stadium_en: "Houston Stadium"
  },

  # ---------------- Quarter-final ----------------
  {
    home: "BRA",
    away: "FRA",
    stage: :quarter_final,
    kickoff_at: now + 7.days + 15.hours,
    stadium: "Estadio Dallas",
    stadium_en: "Dallas Stadium"
  },
  {
    home: "ARG",
    away: "GER",
    stage: :quarter_final,
    kickoff_at: now + 7.days + 19.hours,
    stadium: "Estadio Boston",
    stadium_en: "Boston Stadium"
  },

  # ---------------- Semi-final ----------------
  {
    home: "BRA",
    away: "ARG",
    stage: :semi_final,
    kickoff_at: now + 9.days + 16.hours,
    stadium: "Estadio Ciudad de México",
    stadium_en: "Mexico City Stadium"
  },
  {
    home: "FRA",
    away: "ESP",
    stage: :semi_final,
    kickoff_at: now + 9.days + 20.hours,
    stadium: "Estadio Seattle",
    stadium_en: "Seattle Stadium"
  },

  # ---------------- Third place ----------------
  {
    home: "GER",
    away: "ESP",
    stage: :third_place,
    kickoff_at: now + 11.days + 16.hours,
    stadium: "Estadio Toronto",
    stadium_en: "Toronto Stadium"
  },

  # ---------------- Final ----------------
  {
    home: "ARG",
    away: "FRA",
    stage: :final,
    kickoff_at: now + 12.days + 16.hours,
    stadium: "Estadio Nueva York Nueva Jersey",
    stadium_en: "New York New Jersey Stadium"
  }
]

created = 0

demo_matches.each do |data|
  already_existed = Match.exists?(
    tournament: world_cup,
    home_team: team(data[:home]),
    away_team: team(data[:away]),
    kickoff_at: data[:kickoff_at]
  )

  Match.find_or_create_by!(
    tournament: world_cup,
    home_team: team(data[:home]),
    away_team: team(data[:away]),
    kickoff_at: data[:kickoff_at]
  ) do |m|
    m.group     = data[:group] ? group(world_cup, data[:group]) : nil
    m.stage     = data[:stage]
    m.stadium   = data[:stadium]
    m.completed = false
  end

  created += 1 unless already_existed
end

puts "Screenshot demo: #{created} new pending matches created (#{demo_matches.size} total expected)."
