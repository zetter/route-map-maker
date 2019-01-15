input = 'resources/renamed/*.svg'
output = 'static/tiles/'
size = 50
need_rotation = ['r-i.png', 'b-i.png']

Dir[input].each do |image_path|
  filename = File.basename(image_path).gsub('.svg', '.png')
  output_path = output + filename
  `cairosvg --output-width #{size} --output-height #{size} '#{image_path}' -o '#{output_path}'`
  `convert #{output_path} -background white -flatten #{output_path}`
  if need_rotation.include?(filename)
    `mogrify -rotate "90" #{output_path}`
  end
end
