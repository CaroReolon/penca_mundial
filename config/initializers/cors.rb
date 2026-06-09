allowed_origins = [
  "http://localhost:5173",
  "http://18.220.250.174",
  "http://pencaworldcup.webhop.me",
  "https://pencaworldcup.webhop.me",
  ENV["FRONTEND_URL"]
].compact.uniq

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      expose: ["Authorization"],
      methods: %i[get post put patch delete options head]
  end
end