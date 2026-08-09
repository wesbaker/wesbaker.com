#!/usr/bin/env ruby
# frozen_string_literal: true

# Tests for bin/dependabot-compat-score.rb. Stdlib minitest only, zero real
# network calls — Net::HTTP is stubbed in every test that would otherwise hit
# the network.
#
# Run with: ruby test/dependabot_compat_score_test.rb

require "minitest/autorun"
require "net/http"

require_relative "../bin/dependabot-compat-score"

class DependabotCompatScoreTest < Minitest::Test
  BADGE_URL = "https://dependabot-badges.githubapp.com/badges/compatibility_score" \
              "?dependency-name=sass&package-manager=npm_and_yarn" \
              "&previous-version=1.101.7&new-version=1.102.0"

  SINGLE_DEP_BODY = <<~BODY
    Bumps [sass](https://github.com/sass/dart-sass) from 1.101.7 to 1.102.0.

    [![Dependabot compatibility score](#{BADGE_URL})](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)
  BODY

  MULTI_DEP_BODY = <<~BODY
    Bumps the npm_and_yarn group with 2 updates: [astro](https://github.com/withastro/astro) and [sass](https://github.com/sass/dart-sass).

    Updates `astro` from 7.1.6 to 7.2.0
    Updates `sass` from 1.101.7 to 1.102.0
  BODY

  def svg_for(percentage)
    %(<svg aria-label="compatibility: #{percentage}%">...</svg>)
  end

  def unknown_svg
    %(<svg aria-label="compatibility: unknown">...</svg>)
  end

  def stub_response(body:, code: "200")
    response = Net::HTTPResponse::CODE_TO_OBJ.fetch(code, Net::HTTPOK).allocate
    response.instance_variable_set(:@code, code)
    response.instance_variable_set(:@read, true)
    response.initialize_http_header({})
    response.body = body
    response
  end

  def test_valid_percentage_is_extracted_from_badge_svg
    response = stub_response(body: svg_for(83))

    result = Net::HTTP.stub :get_response, response do
      DependabotCompatScore.score_for(SINGLE_DEP_BODY)
    end

    assert_equal 83, result
  end

  def test_svg_reporting_unknown_returns_unknown
    response = stub_response(body: unknown_svg)

    result = Net::HTTP.stub :get_response, response do
      DependabotCompatScore.score_for(SINGLE_DEP_BODY)
    end

    assert_equal "unknown", result
  end

  def test_body_with_no_badge_url_returns_unknown_without_network_call
    called = false
    fake_get_response = lambda do |*|
      called = true
      raise "network should not be called when there is no badge URL"
    end

    result = Net::HTTP.stub :get_response, fake_get_response do
      DependabotCompatScore.score_for(MULTI_DEP_BODY)
    end

    refute called
    assert_equal "unknown", result
  end

  def test_network_failure_returns_unknown
    raiser = lambda { |*| raise SocketError, "getaddrinfo: nodename nor servname provided" }

    result = Net::HTTP.stub :get_response, raiser do
      DependabotCompatScore.score_for(SINGLE_DEP_BODY)
    end

    assert_equal "unknown", result
  end

  def test_follows_redirect_from_api_dependabot_com
    redirect = stub_response(body: "", code: "301")
    redirect["location"] = BADGE_URL
    final = stub_response(body: svg_for(91))

    responses = [redirect, final]
    fake_get_response = lambda { |*| responses.shift }

    result = Net::HTTP.stub :get_response, fake_get_response do
      DependabotCompatScore.score_for(SINGLE_DEP_BODY)
    end

    assert_equal 91, result
  end
end
