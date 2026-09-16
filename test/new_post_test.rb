#!/usr/bin/env ruby
# frozen_string_literal: true

require "minitest/autorun"
require "open3"
require "tmpdir"

class NewPostTest < Minitest::Test
  SCRIPT = File.expand_path("../bin/new-post", __dir__)

  def run_generator(posts_dir, *args)
    env = {
      "POSTS_DIR" => posts_dir,
      "POST_DATE" => "2026-09-16T00:00:00-04:00"
    }
    Open3.capture3(env, SCRIPT, *args)
  end

  def test_creates_a_dated_post_from_a_title
    Dir.mktmpdir do |posts_dir|
      stdout, stderr, status = run_generator(posts_dir, "Arachne Was the Problem")
      path = File.join(posts_dir, "2026-09-16-arachne-was-the-problem.md")

      assert status.success?, "#{stdout}\n#{stderr}"
      assert_path_exists path
      content = File.read(path)
      assert_includes content, 'title: "Arachne Was the Problem"'
      assert_includes content, 'date: "2026-09-16T00:00:00-04:00"'
      assert_includes content, "draft: true"
      assert_includes content, "## What happened"
    end
  end

  def test_refuses_to_overwrite_an_existing_post
    Dir.mktmpdir do |posts_dir|
      path = File.join(posts_dir, "2026-09-16-existing-post.md")
      File.write(path, "keep this content\n")

      _stdout, stderr, status = run_generator(posts_dir, "Existing Post")

      refute status.success?
      assert_includes stderr, "already exists"
      assert_equal "keep this content\n", File.read(path)
    end
  end

  def test_with_images_creates_a_post_directory_with_index_file
    Dir.mktmpdir do |posts_dir|
      stdout, stderr, status = run_generator(posts_dir, "--with-images", "Terrain With Images")
      path = File.join(posts_dir, "2026-09-16-terrain-with-images", "index.mdx")

      assert status.success?, "#{stdout}\n#{stderr}"
      assert_path_exists path
      assert File.directory?(File.dirname(path))
      assert_includes File.read(path), 'title: "Terrain With Images"'
    end
  end
end
