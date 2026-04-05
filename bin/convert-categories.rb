require 'yaml'

def update_frontmatter(file)
  content = File.read(file)

  # Split front matter and body
  if content =~ /\A---\s*\n(.*?)\n---\s*\n(.*)/m
    frontmatter = YAML.safe_load($1, permitted_classes: [Time]) || {}
    body = $2

    # Check for 'categories' key and convert it
    if frontmatter.key?('categories')
      frontmatter['taxonomies'] ||= {}
      frontmatter['taxonomies']['tags'] = frontmatter.delete('categories')

      # Write updated content back to the file
      updated_frontmatter = frontmatter.to_yaml.strip
      File.write(file, "---\n#{updated_frontmatter}\n---\n#{body}")
      puts "Updated: #{file}"
    else
      puts "No 'categories' key found in: #{file}"
    end
  else
    puts "No front matter found in: #{file}"
  end
end

def process_directory(dir)
  Dir.glob("#{dir}/**/*.md").each do |file|
    update_frontmatter(file)
  end
end

# Replace 'your_directory_path' with the path to your markdown files
directory_path = 'posts'
process_directory(directory_path)
