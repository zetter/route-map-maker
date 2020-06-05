import WFC from 'wavefunctioncollapse';
import Jimp from 'jimp';

class RouteMapMaker {

  constructor({canvas, x, y, tileSize}) {
    this.canvas = canvas;
    this.startUpdate = this.startUpdate.bind(this);
    this.x = x
    this.y = y
    this.tileSize = tileSize
  }

  loadTileBitmapData(basePath, tile, number) {
    var unique = number !== null,
    tilePath = basePath + tile.name + (unique ? ' ' + number : '') + '.png';

    return Jimp.read(tilePath).then((result) => {
      if (unique) {
        tile.bitmap[number] = new Uint8Array(result.bitmap.data); //add the bitmap data in each tile variant
      } else {
        tile.bitmap = new Uint8Array(result.bitmap.data); //add the bitmap data in each tile
      }

      return true;
    });
  }

  addBitmapDataToStructure(structure, callback) {
    var promises = [],
      path = structure.path,
      unique = !!structure.unique;

    structure.tiles.forEach((tile) => {
      if (unique) {
        if (tile.symmetry === 'X') {
          tile.bitmap = new Array(1);
          promises.push(this.loadTileBitmapData(path, tile, 0));
        } else {
          tile.bitmap = new Array(4);
          promises.push(this.loadTileBitmapData(path, tile, 0));
          promises.push(this.loadTileBitmapData(path, tile, 1));
          promises.push(this.loadTileBitmapData(path, tile, 2));
          promises.push(this.loadTileBitmapData(path, tile, 3));
        }
      } else {
        promises.push(this.loadTileBitmapData(path, tile, null));
      }
    });

    Promise.all(promises).then(() => {
      callback(null, structure);
    }, (error) => {
      callback(error, null);
    });
  };


  async start(callback)  {
    var generateContext = this.canvas.getContext("2d")
    generateContext.clearRect(0, 0, this.x * this.tileSize, this.y * this.tileSize);

    this.callback = callback

    if (!this.data) {
      const response = await fetch("/tiles.json")
      this.data = await response.json();
    }

    this.addBitmapDataToStructure(this.data, this.startUpdate)
  }

  startUpdate(err, data) {
    var isRunning = true;
    var computingStep = true;
    var model = new WFC.SimpleTiledModel(data, null, this.x, this.y, true);


    var contradiction = false;
    var defaultColor = [255, 255, 255, 255];
    var generateContext = this.canvas.getContext("2d")
    var generateData = generateContext.createImageData(this.x * this.tileSize, this.y * this.tileSize);
    const updateInterval = 10
    let updateCount = 0
    var update = () => {
      if (isRunning) {
        if (computingStep) {
          if (contradiction) {
            model.clear();
          }

          contradiction = !model.iterate(2);
        } else {
          if ((updateCount % updateInterval) === 0 || model.isGenerationComplete()) {
            model.graphics(generateData.data, defaultColor);
            generateContext.putImageData(generateData, 0, 0);
          }

          if (model.isGenerationComplete()) {
            isRunning = false;
            this.callback()
          }

          updateCount = updateCount + 1
        }

        computingStep = !computingStep;
      }

      requestAnimationFrame(update);
    };
    update();
  }
}

export default RouteMapMaker;
