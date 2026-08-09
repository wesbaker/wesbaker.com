#!/usr/bin/env ruby
# frozen_string_literal: true

# Reads a Dependabot PR body on stdin and prints one line to stdout: an
# integer compatibility-score percentage (e.g. "83") or "unknown".
#
# "unknown" is a normal outcome, not an error — the auto-merge workflow
# treats it as a fall-through, not a veto. This script always exits 0.
#
# Stdlib only (net/http, uri) — no gems, no Gemfile.

require "net/http"
require "uri"

module DependabotCompatScore
  BADGE_URL_PATTERN = %r{https://(?:api\.dependabot\.com|dependabot-badges\.githubapp\.com)
                         /badges/compatibility_score\?[^\s)"'<>]+}x.freeze
  PERCENTAGE_PATTERN = /aria-label="compatibility:\s*(\d+)%"/i.freeze
  UNKNOWN = "unknown"
  MAX_REDIRECTS = 5

  module_function

  # @param body [String, nil] the Dependabot PR body
  # @return [Integer, String] a percentage, or "unknown"
  def score_for(body)
    url = extract_badge_url(body)
    return UNKNOWN unless url

    svg = fetch(url)
    return UNKNOWN unless svg

    parse_percentage(svg)
  rescue StandardError
    # Never let a malformed body or unexpected input take down the workflow.
    # "unknown" is a normal, non-blocking outcome.
    UNKNOWN
  end

  def extract_badge_url(body)
    return nil if body.nil?

    # PR bodies can contain non-ASCII bytes (smart quotes, emoji) and the
    # runtime's default external encoding is not guaranteed to be UTF-8.
    # Scrub rather than match against a string Ruby considers invalid.
    body = body.dup.force_encoding(Encoding::UTF_8)
    body = body.encode("UTF-8", invalid: :replace, undef: :replace) unless body.valid_encoding?

    body[BADGE_URL_PATTERN]
  end

  def parse_percentage(svg)
    match = PERCENTAGE_PATTERN.match(svg)
    match ? match[1].to_i : UNKNOWN
  end

  # Fetches url, following redirects (api.dependabot.com 301s to the real
  # badge host). Returns the response body, or nil on any failure.
  def fetch(url)
    uri = URI.parse(url)
    response = nil

    MAX_REDIRECTS.times do
      response = Net::HTTP.get_response(uri)
      break unless response.is_a?(Net::HTTPRedirection)

      location = response["location"]
      return nil unless location

      uri = URI.parse(location)
    end

    return nil unless response.is_a?(Net::HTTPSuccess)

    response.body
  rescue StandardError
    nil
  end
end

if $PROGRAM_NAME == __FILE__
  begin
    puts DependabotCompatScore.score_for($stdin.read)
  rescue StandardError
    # Belt and suspenders: score_for already rescues internally, but nothing
    # here is allowed to exit non-zero. "unknown" is always a safe answer.
    puts DependabotCompatScore::UNKNOWN
  end
end
