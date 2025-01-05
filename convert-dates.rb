require 'time'

# Function to convert date from ISO 8601 to RFC 3339
def convert_date_to_rfc3339(date)
  begin
    Time.parse(date).iso8601 # `iso8601` ensures RFC 3339 format
  rescue ArgumentError
    nil # Return nil if the date format is invalid
  end
end

# Function to process a single file
def process_file(file_path)
  content = File.read(file_path)
  updated_content = content.gsub(/^date:\s*(.+)$/) do |match|
    date = $1.strip
    converted_date = convert_date_to_rfc3339(date)
    if converted_date
      "date: #{converted_date}"
    else
      match # Leave the line unchanged if the date can't be converted
    end
  end

  # Write the updated content back to the file only if it has changed
  if content != updated_content
    File.write(file_path, updated_content)
    puts "Updated: #{file_path}"
  end
end

# Function to recursively find and process .md files
def process_directory(directory)
  Dir.glob(File.join(directory, '**', '*.md')).each do |file|
    process_file(file)
  end
end

# Main script execution
if ARGV.empty?
  puts "Usage: ruby script.rb <directory>"
  exit 1
end

directory = ARGV[0]

unless Dir.exist?(directory)
  puts "Error: Directory '#{directory}' does not exist."
  exit 1
end

process_directory(directory)
puts "Processing complete!"
