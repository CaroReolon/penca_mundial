users = [
  {
    first_name: "Joe",
    last_name: "Doe",
    email: "joe.doe@example.com",
    password: "Hola_123"
  }
]

users.each do |data|
  user = User.find_or_initialize_by(email: data[:email])

  user.first_name = data[:first_name]
  user.last_name = data[:last_name]
  user.password = data[:password]
  user.password_confirmation = data[:password]

  user.save!
end

puts "Created #{User.count} users"