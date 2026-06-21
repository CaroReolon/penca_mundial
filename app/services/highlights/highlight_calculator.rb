module Highlights
  class HighlightCalculator
    attr_reader :play_group

    def initialize(play_group:)
      @play_group = play_group
    end

    def self.call(...)
      new(...).call
    end
  end
end