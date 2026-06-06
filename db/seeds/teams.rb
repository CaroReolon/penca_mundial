teams = [

# CONMEBOL

{ name: "Argentina", code: "ARG", short_name: "ARG", flag: "🇦🇷", confederation: "CONMEBOL" },
{ name: "Brasil", code: "BRA", short_name: "BRA", flag: "🇧🇷", confederation: "CONMEBOL" },
{ name: "Uruguay", code: "URU", short_name: "URU", flag: "🇺🇾", confederation: "CONMEBOL" },
{ name: "Ecuador", code: "ECU", short_name: "ECU", flag: "🇪🇨", confederation: "CONMEBOL" },
{ name: "Colombia", code: "COL", short_name: "COL", flag: "🇨🇴", confederation: "CONMEBOL" },
{ name: "Paraguay", code: "PAR", short_name: "PAR", flag: "🇵🇾", confederation: "CONMEBOL" },

# CONCACAF

{ name: "Canadá", code: "CAN", short_name: "CAN", flag: "🇨🇦", confederation: "CONCACAF" },
{ name: "Estados Unidos", code: "USA", short_name: "USA", flag: "🇺🇸", confederation: "CONCACAF" },
{ name: "México", code: "MEX", short_name: "MEX", flag: "🇲🇽", confederation: "CONCACAF" },
{ name: "Haití", code: "HAI", short_name: "HAI", flag: "🇭🇹", confederation: "CONCACAF" },
{ name: "Panamá", code: "PAN", short_name: "PAN", flag: "🇵🇦", confederation: "CONCACAF" },
{ name: "Curazao", code: "CUW", short_name: "CUW", flag: "🇨🇼", confederation: "CONCACAF" },

# UEFA

{ name: "Inglaterra", code: "ENG", short_name: "ENG", flag: "🏴", confederation: "UEFA" },
{ name: "Francia", code: "FRA", short_name: "FRA", flag: "🇫🇷", confederation: "UEFA" },
{ name: "Croacia", code: "CRO", short_name: "CRO", flag: "🇭🇷", confederation: "UEFA" },
{ name: "Portugal", code: "POR", short_name: "POR", flag: "🇵🇹", confederation: "UEFA" },
{ name: "Noruega", code: "NOR", short_name: "NOR", flag: "🇳🇴", confederation: "UEFA" },
{ name: "Alemania", code: "GER", short_name: "GER", flag: "🇩🇪", confederation: "UEFA" },
{ name: "Países Bajos", code: "NED", short_name: "NED", flag: "🇳🇱", confederation: "UEFA" },
{ name: "Bélgica", code: "BEL", short_name: "BEL", flag: "🇧🇪", confederation: "UEFA" },
{ name: "Austria", code: "AUT", short_name: "AUT", flag: "🇦🇹", confederation: "UEFA" },
{ name: "Suiza", code: "SUI", short_name: "SUI", flag: "🇨🇭", confederation: "UEFA" },
{ name: "España", code: "ESP", short_name: "ESP", flag: "🇪🇸", confederation: "UEFA" },
{ name: "Escocia", code: "SCO", short_name: "SCO", flag: "🏴", confederation: "UEFA" },
{ name: "Turquía", code: "TUR", short_name: "TUR", flag: "🇹🇷", confederation: "UEFA" },
{ name: "República Checa", code: "CZE", short_name: "CZE", flag: "🇨🇿", confederation: "UEFA" },
{ name: "Suecia", code: "SWE", short_name: "SWE", flag: "🇸🇪", confederation: "UEFA" },
{ name: "Bosnia y Herzegovina", code: "BIH", short_name: "BIH", flag: "🇧🇦", confederation: "UEFA" },

# CAF

{ name: "Marruecos", code: "MAR", short_name: "MAR", flag: "🇲🇦", confederation: "CAF" },
{ name: "Túnez", code: "TUN", short_name: "TUN", flag: "🇹🇳", confederation: "CAF" },
{ name: "Egipto", code: "EGY", short_name: "EGY", flag: "🇪🇬", confederation: "CAF" },
{ name: "Argelia", code: "ALG", short_name: "ALG", flag: "🇩🇿", confederation: "CAF" },
{ name: "Ghana", code: "GHA", short_name: "GHA", flag: "🇬🇭", confederation: "CAF" },
{ name: "Cabo Verde", code: "CPV", short_name: "CPV", flag: "🇨🇻", confederation: "CAF" },
{ name: "Sudáfrica", code: "RSA", short_name: "RSA", flag: "🇿🇦", confederation: "CAF" },
{ name: "Costa de Marfil", code: "CIV", short_name: "CIV", flag: "🇨🇮", confederation: "CAF" },
{ name: "Senegal", code: "SEN", short_name: "SEN", flag: "🇸🇳", confederation: "CAF" },
{ name: "República Democrática del Congo", code: "COD", short_name: "COD", flag: "🇨🇩", confederation: "CAF" },

# AFC

{ name: "Japón", code: "JPN", short_name: "JPN", flag: "🇯🇵", confederation: "AFC" },
{ name: "Irán", code: "IRN", short_name: "IRN", flag: "🇮🇷", confederation: "AFC" },
{ name: "Uzbekistán", code: "UZB", short_name: "UZB", flag: "🇺🇿", confederation: "AFC" },
{ name: "Corea del Sur", code: "KOR", short_name: "KOR", flag: "🇰🇷", confederation: "AFC" },
{ name: "Jordania", code: "JOR", short_name: "JOR", flag: "🇯🇴", confederation: "AFC" },
{ name: "Australia", code: "AUS", short_name: "AUS", flag: "🇦🇺", confederation: "AFC" },
{ name: "Qatar", code: "QAT", short_name: "QAT", flag: "🇶🇦", confederation: "AFC" },
{ name: "Arabia Saudita", code: "KSA", short_name: "KSA", flag: "🇸🇦", confederation: "AFC" },
{ name: "Iraq", code: "IRQ", short_name: "IRQ", flag: "🇮🇶", confederation: "AFC" },

# OFC

{ name: "Nueva Zelanda", code: "NZL", short_name: "NZL", flag: "🇳🇿", confederation: "OFC" }
]

teams.each do |team|
Team.find_or_create_by!(code: team[:code]) do |t|
t.assign_attributes(team)
end
end

puts "Created #{Team.count} teams"
