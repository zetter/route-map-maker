require 'json'

class Tile
  attr_reader :name, :symmetry, :edges, :weight

  def initialize(name:, symmetry:, edges:, weight: 1)
    @name = name
    @symmetry = symmetry
    @edges = edges
    @weight = weight
  end

  def left_edges_with_names
    edges.rotate(1).zip(['', ' 1', ' 2', ' 3']).map {|edge, suffix| [edge, @name + suffix ]}
  end

  def right_edges_with_names
    edges.rotate(3).zip(['', ' 1', ' 2', ' 3']).map {|edge, suffix| [edge, @name + suffix ]}
  end

  def left_edges_to_check(&block)
    edges_to_check(left_edges_with_names, &block)
  end

  def right_edges_to_check(&block)
    edges_to_check(right_edges_with_names, &block)
  end

  def edges_to_check(edges, &block)
    if @symmetry == 'T'
      edges.values_at(0, 1, 3).each(&block)
    elsif @symmetry == 'L'
      edges.values_at(0, 1).each(&block)
    elsif @symmetry == 'I'
      edges.values_at(0, 1).each(&block)
    elsif @symmetry == 'X'
      edges.values_at(0).each(&block)
    else
      raise 'unknown symmetry'
    end
  end
end

json_config = File.read('tiles.json')
config = JSON.parse(json_config)
TILES = config['tiles'].map do |tile_config|
  Tile.new(
    name: tile_config['name'],
    symmetry: tile_config['symmetry'],
    edges: tile_config['edges'],
    weight: tile_config.fetch('weight', 1),
  )
end

output = {
  path: config['path'],
  tilesize: config['tilesize'],
  tiles: [],
  neighbors: []
}


TILES.each do |tile|
  output[:tiles] << { name: tile.name, symmetry: tile.symmetry, weight: tile.weight.to_f }
end

TILES.each.with_index do |left_tile, left_tile_index|
  TILES.each.with_index do |right_tile, right_tile_index|
    next if left_tile_index > right_tile_index
    left_tile.left_edges_to_check.each do |(left_edge, left_edge_name)|
      right_tile.right_edges_to_check.each do |(right_edge, right_edge_name)|
        if left_edge == right_edge
          output[:neighbors] << { left: left_edge_name, right: right_edge_name }
        end
      end
    end
  end
end

puts JSON.pretty_generate(output)
