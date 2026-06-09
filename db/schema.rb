# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_06_09_160000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "group_teams", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "team_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id", "team_id"], name: "index_group_teams_on_group_id_and_team_id", unique: true
    t.index ["group_id"], name: "index_group_teams_on_group_id"
    t.index ["team_id"], name: "index_group_teams_on_team_id"
  end

  create_table "groups", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id", "name"], name: "index_groups_on_tournament_id_and_name", unique: true
    t.index ["tournament_id"], name: "index_groups_on_tournament_id"
  end

  create_table "matches", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.bigint "group_id"
    t.bigint "home_team_id"
    t.bigint "away_team_id"
    t.bigint "winner_team_id"
    t.datetime "kickoff_at"
    t.integer "home_score"
    t.integer "away_score"
    t.integer "stage", null: false
    t.bigint "next_match_id"
    t.integer "next_match_slot"
    t.boolean "completed", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "stadium"
    t.string "stadium_en"
    t.index ["away_team_id"], name: "index_matches_on_away_team_id"
    t.index ["group_id"], name: "index_matches_on_group_id"
    t.index ["home_team_id"], name: "index_matches_on_home_team_id"
    t.index ["next_match_id"], name: "index_matches_on_next_match_id"
    t.index ["tournament_id"], name: "index_matches_on_tournament_id"
    t.index ["winner_team_id"], name: "index_matches_on_winner_team_id"
  end

  create_table "play_group_invitations", force: :cascade do |t|
    t.bigint "play_group_id", null: false
    t.string "email"
    t.bigint "invited_by_id", null: false
    t.string "token", null: false
    t.integer "status", default: 0, null: false
    t.bigint "accepted_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["play_group_id"], name: "index_play_group_invitations_on_play_group_id"
    t.index ["token"], name: "index_play_group_invitations_on_token", unique: true
  end

  create_table "play_group_memberships", force: :cascade do |t|
    t.bigint "play_group_id", null: false
    t.bigint "user_id", null: false
    t.integer "role", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["play_group_id", "user_id"], name: "idx_play_group_memberships_unique", unique: true
    t.index ["play_group_id", "user_id"], name: "index_play_group_memberships_on_play_group_id_and_user_id", unique: true
    t.index ["user_id"], name: "index_play_group_memberships_on_user_id"
  end

  create_table "play_groups", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "tournament_id", null: false
    t.bigint "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tournament_id"], name: "index_play_groups_on_tournament_id"
  end

  create_table "predictions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "match_id", null: false
    t.integer "home_score", null: false
    t.integer "away_score", null: false
    t.integer "points_awarded", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_predictions_on_match_id"
    t.index ["user_id", "match_id"], name: "index_predictions_on_user_id_and_match_id", unique: true
    t.index ["user_id"], name: "index_predictions_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name", null: false
    t.string "short_name", null: false
    t.string "code", null: false
    t.string "flag", null: false
    t.string "confederation", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name_en"
    t.string "short_name_en"
    t.index ["code"], name: "index_teams_on_code", unique: true
  end

  create_table "tournament_rankings", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.bigint "user_id", null: false
    t.integer "points", default: 0, null: false
    t.integer "position"
    t.integer "previous_position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "play_group_id"
    t.index ["play_group_id"], name: "index_tournament_rankings_on_play_group_id"
    t.index ["tournament_id", "user_id", "play_group_id"], name: "index_tournament_rankings_on_tournament_user_group", unique: true
    t.index ["tournament_id"], name: "index_tournament_rankings_on_tournament_id"
    t.index ["user_id"], name: "index_tournament_rankings_on_user_id"
  end

  create_table "tournament_teams", force: :cascade do |t|
    t.bigint "tournament_id", null: false
    t.bigint "team_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["team_id"], name: "index_tournament_teams_on_team_id"
    t.index ["tournament_id"], name: "index_tournament_teams_on_tournament_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.string "name", null: false
    t.date "start_date"
    t.date "end_date"
    t.integer "status", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "group_teams", "groups"
  add_foreign_key "group_teams", "teams"
  add_foreign_key "groups", "tournaments"
  add_foreign_key "matches", "groups"
  add_foreign_key "matches", "matches", column: "next_match_id"
  add_foreign_key "matches", "teams", column: "away_team_id"
  add_foreign_key "matches", "teams", column: "home_team_id"
  add_foreign_key "matches", "teams", column: "winner_team_id"
  add_foreign_key "matches", "tournaments"
  add_foreign_key "play_group_invitations", "play_groups"
  add_foreign_key "play_group_memberships", "play_groups"
  add_foreign_key "play_group_memberships", "users"
  add_foreign_key "predictions", "matches"
  add_foreign_key "predictions", "users"
  add_foreign_key "tournament_teams", "teams"
  add_foreign_key "tournament_teams", "tournaments"
end
