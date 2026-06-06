world_cup = Tournament.find_by!(
name: "FIFA World Cup 2026"
)

def team(code)
Team.find_by!(code: code)
end

groups = {
"A" => %w[MEX RSA KOR CZE],
"B" => %w[CAN BIH QAT SUI],
"C" => %w[BRA MAR HAI SCO],
"D" => %w[USA PAR AUS TUR],
"E" => %w[GER CUW CIV ECU],
"F" => %w[NED JPN SWE TUN],
"G" => %w[BEL EGY IRN NZL],
"H" => %w[ESP CPV KSA URU],
"I" => %w[FRA SEN IRQ NOR],
"J" => %w[ARG ALG AUT JOR],
"K" => %w[POR COD UZB COL],
"L" => %w[ENG CRO GHA PAN]
}

groups.each do |group_name, team_codes|
group = Group.find_by!(
tournament: world_cup,
name: group_name
)

team_codes.each do |code|
GroupTeam.find_or_create_by!(
group: group,
team: team(code)
)
end
end

puts "Created #{GroupTeam.count} group-team relations"
