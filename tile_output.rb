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

  def left_edges_to_check(&block)
    if @symmetry == 'T'
      left_edges_with_names.values_at(0, 1, 3).each(&block)
    elsif @symmetry == 'L'
      left_edges_with_names.values_at(0, 1).each(&block)
    elsif @symmetry == 'I'
      left_edges_with_names.values_at(0, 1).each(&block)
    elsif @symmetry == 'X'
      left_edges_with_names.values_at(0).each(&block)
    else
      raise 'unknown symmetry'
    end
  end

  def right_edges_with_names
    edges.rotate(3).zip(['', ' 1', ' 2', ' 3']).map {|edge, suffix| [edge, @name + suffix ]}
  end

  def right_edges_to_check(&block)
    if @symmetry == 'T'
      right_edges_with_names.values_at(0, 1, 3).each(&block)
    elsif @symmetry == 'L'
      right_edges_with_names.values_at(0, 1).each(&block)
    elsif @symmetry == 'I'
      right_edges_with_names.values_at(0, 1).each(&block)
    elsif @symmetry == 'X'
      right_edges_with_names.values_at(0).each(&block)
    else
      raise 'unknown symmetry'
    end
  end
end

TILES = [
  Tile.new(
    name: 'corner',
    symmetry: 'L',
    edges: ['path', 'path', 'none', 'none']
  ),
  Tile.new(
    name: 'cross',
    symmetry: 'I',
    edges: ['path', 'path', 'path', 'path']
  ),
  Tile.new(
    name: 'empty',
    weight: '3',
    symmetry: 'X',
    edges: ['none', 'none', 'none', 'none']
  ),
  Tile.new(
    name: 'line',
    symmetry: 'I',
    edges: ['none', 'path', 'none', 'path']
  ),
  Tile.new(
    name: 't',
    symmetry: 'T',
    weight: '0.5',
    edges: ['none', 'path', 'path', 'path']
  ),
  Tile.new(
    name: 'end',
    weight: '0.1',
    symmetry: 'T',
    edges: ['none', 'none', 'path', 'none']
  ),
  Tile.new(
    name: 'station',
    weight: '0.5',
    symmetry: 'I',
    edges: ['path', 'none', 'path', 'none']
  ),
  Tile.new(
    name: 'line-b',
    weight: '0.3',
    symmetry: 'I',
    edges: ['none', 'path-b', 'none', 'path-b']
  ),
  Tile.new(
    name: 'corner-b',
    weight: '0.3',
    symmetry: 'L',
    edges: ['path-b', 'path-b', 'none', 'none']
  ),
  Tile.new(
    name: 'cross-b-r',
    weight: '0.1',
    symmetry: 'I',
    edges: ['path-b', 'path', 'path-b', 'path']
  ),
  Tile.new(
    name: 'cross-r-b',
    weight: '0.1',
    symmetry: 'I',
    edges: ['path', 'path-b', 'path', 'path-b']
  )
]

neighbors = []

TILES.each.with_index do |left_tile, left_tile_index|
  TILES.each.with_index do |right_tile, right_tile_index|
    next if left_tile_index > right_tile_index
    left_tile.left_edges_to_check.each do |(left_edge, left_edge_name)|
      right_tile.right_edges_to_check.each do |(right_edge, right_edge_name)|
        if left_edge == right_edge
          neighbors << [left_edge_name, right_edge_name]
        end
      end
    end
  end
end

data = {
  path: '/tiles/',
  tilesize: 50,
  tiles: [],
  neighbors: []
}

TILES.each do |tile|
  data[:tiles] << { name: tile.name, symmetry: tile.symmetry, weight: tile.weight.to_f }
end

neighbors.each do |(left, right)|
  data[:neighbors] << { left: left, right: right }
end

puts JSON.pretty_generate(data)
