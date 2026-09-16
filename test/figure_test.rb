#!/usr/bin/env ruby
# frozen_string_literal: true

require "minitest/autorun"

class FigureTest < Minitest::Test
  IMAGE_STYLESHEET = File.expand_path("../src/styles/parts/_image.scss", __dir__)

  def test_height_constrained_figures_keep_their_intrinsic_width
    styles = File.read(IMAGE_STYLESHEET)

    assert_includes styles, "width: auto;\n    height: auto;\n    max-height: 500px;"
  end
end
