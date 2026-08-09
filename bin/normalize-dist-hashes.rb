#!/usr/bin/env ruby
# frozen_string_literal: true

# Normalizes Astro's content-addressed asset hashes (e.g.
# `_astro/index.BX3kLm2p.css`) to a stable placeholder, in both filenames and
# every reference inside built text files (HTML, CSS, JS, XML, JSON...).
#
# Used by .github/workflows/output-diff.yml to diff two builds of dist/
# without every page showing up as changed just because one CSS byte moved
# and cascaded into a new hash.
#
# Usage: bin/normalize-dist-hashes.rb <dist-dir>

require "fileutils"

module NormalizeDistHashes
  HASH_FILENAME_PATTERN = /\A(?<stem>.+)\.(?<hash>[A-Za-z0-9_-]{6,10})\.(?<ext>[A-Za-z0-9]+)\z/.freeze
  TEXT_EXTENSIONS = %w[html css js mjs xml json svg txt webmanifest].freeze
  PLACEHOLDER = "HASH"

  module_function

  # Renames every hashed asset under dist_dir to use PLACEHOLDER in place of
  # its hash. Returns a { old_basename => new_basename } map.
  def rename_hashed_assets(dist_dir)
    renames = {}

    each_file(dist_dir) do |path|
      basename = File.basename(path)
      match = HASH_FILENAME_PATTERN.match(basename)
      next unless match

      new_basename = "#{match[:stem]}.#{PLACEHOLDER}.#{match[:ext]}"
      next if new_basename == basename

      new_path = disambiguate(File.join(File.dirname(path), new_basename))
      FileUtils.mv(path, new_path)
      renames[basename] = File.basename(new_path)
    end

    renames
  end

  # Rewrites every reference to a renamed file inside text files under
  # dist_dir, using the map returned by rename_hashed_assets.
  def rewrite_references(dist_dir, renames)
    return if renames.empty?

    # Longest names first, so no old name is a substring-clobbered by an
    # earlier, shorter replacement.
    ordered = renames.sort_by { |old_name, _| -old_name.length }

    each_file(dist_dir) do |path|
      next unless TEXT_EXTENSIONS.include?(File.extname(path).delete_prefix("."))

      content = File.read(path)
      original = content
      ordered.each { |old_name, new_name| content = content.gsub(old_name, new_name) }
      File.write(path, content) if content != original
    end
  end

  def normalize(dist_dir)
    renames = rename_hashed_assets(dist_dir)
    rewrite_references(dist_dir, renames)
    renames
  end

  def each_file(dist_dir)
    Dir.glob(File.join(dist_dir, "**", "*")).sort.each do |path|
      yield path if File.file?(path)
    end
  end
  private_class_method :each_file

  def disambiguate(path)
    return path unless File.exist?(path)

    dir = File.dirname(path)
    ext = File.extname(path)
    base = File.basename(path, ext)

    n = 2
    loop do
      candidate = File.join(dir, "#{base}-#{n}#{ext}")
      return candidate unless File.exist?(candidate)

      n += 1
    end
  end
  private_class_method :disambiguate
end

if $PROGRAM_NAME == __FILE__
  dist_dir = ARGV[0]
  abort "usage: #{$PROGRAM_NAME} <dist-dir>" unless dist_dir
  abort "#{dist_dir}: not a directory" unless Dir.exist?(dist_dir)

  renames = NormalizeDistHashes.normalize(dist_dir)
  warn "normalized #{renames.size} hashed asset name(s) in #{dist_dir}"
end
