world_cup = Tournament.find_or_create_by!(
  name: "FIFA World Cup 2026"
) do |t|
  t.start_date = Date.new(2026, 6, 11)
  t.end_date = Date.new(2026, 7, 19)
  t.status = :scheduled
end

puts "Created #{Tournament.count} tournaments"