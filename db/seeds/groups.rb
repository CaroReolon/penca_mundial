world_cup = Tournament.find_by!(
name: "FIFA World Cup 2026"
)

("A".."L").each do |group_name|
Group.find_or_create_by!(
tournament: world_cup,
name: group_name
)
end

puts "Created #{Group.count} groups"
