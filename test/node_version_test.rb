#!/usr/bin/env ruby
# frozen_string_literal: true

require "minitest/autorun"
require "json"
require "yaml"

class NodeVersionTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)

  def test_pinned_node_version_meets_astros_minimum
    version = File.read(File.join(ROOT, ".node-version")).strip
    assert_match(/\A\d+\.\d+\.\d+\z/, version)
    lock = JSON.parse(File.read(File.join(ROOT, "package-lock.json")))
    requirement = lock.fetch("packages").fetch("node_modules/astro").fetch("engines").fetch("node")
    assert Gem::Requirement.new(requirement).satisfied_by?(Gem::Version.new(version)),
      "Node #{version} must satisfy Astro's #{requirement} requirement"
  end

  def test_build_workflows_use_the_shared_node_version
    { "check.yml" => ".node-version", "output-diff.yml" => "pr/.node-version" }.each do |workflow, version_file|
      config = YAML.load_file(File.join(ROOT, ".github/workflows", workflow))
      steps = config.fetch("jobs").values.flat_map { |job| job.fetch("steps") }
      setup = steps.find { |step| step["uses"]&.start_with?("actions/setup-node@") }
      assert_equal version_file, setup.fetch("with")["node-version-file"], workflow
      refute setup.fetch("with").key?("node-version"), workflow
    end
  end
end
