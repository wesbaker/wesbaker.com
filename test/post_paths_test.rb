#!/usr/bin/env ruby
# frozen_string_literal: true

require "minitest/autorun"
require "open3"

class PostPathsTest < Minitest::Test
  def test_directory_posts_use_the_directory_slug_without_index
    _stdout, stderr, status = Open3.capture3(
      { "INCLUDE_DRAFTS" => "true" },
      "npm", "run", "build"
    )

    assert status.success?, stderr
    post_path = "dist/posts/prusaslicer-and-printing-miniature-terrain/index.html"
    assert_path_exists post_path
    refute_path_exists "dist/posts/prusaslicer-and-printing-miniature-terrain/index/index.html"

    html = File.read(post_path)
    assert_equal 2, html.scan('class="figure-grid"').length
  end
end
