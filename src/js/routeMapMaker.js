import WFC from 'wavefunctioncollapse';
import Jimp from 'jimp';

class RouteMapMaker {

  constructor(canvas) {
    this.canvas = canvas;
    this.startUpdate = this.startUpdate.bind(this);
    console.log(canvas)
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

  start() {
    fetch("/tiles.json")
      .then(response =>  {
        return response.json();
      })
      .then(data => {
        this.addBitmapDataToStructure(data, this.startUpdate);
      })
      .catch(error => {
        console.log(error);
      });
  }

  startUpdate(err, data) {
    var isRunning = true;
    var computingStep = true;
    var model = new WFC.SimpleTiledModel(data, null, 15, 15, false);
    model.clear = function() {
        var x,
            y,
            t;

        for (x = 0; x < this.FMX; x++) {
            for (y = 0; y < this.FMY; y++) {
                var on_edge = (x === 0) || (x === this.FMX - 1) || (y === 0) || (y === this.FMY - 1);

                for (t = 0; t < this.T; t++) {
                    this.wave[x][y][t] = on_edge ? (t === 0) : true;
                }

                this.changes[x][y] = on_edge;
            }
        }

        this.initiliazedField = true;
        this.generationComplete = false;
    };


    var contradiction = false;
    var defaultColor = [0, 0, 0, 255];
    var generateContext = this.canvas.getContext("2d")
    var generateData = generateContext.createImageData(750, 750);
    var update = () => {
      if (isRunning) {
        if (computingStep) {
          if (contradiction) {
            model.clear();
          }

          contradiction = !model.iterate(2);
        } else {
          model.graphics(generateData.data, defaultColor);
          generateContext.putImageData(generateData, 0, 0);

          if (model.isGenerationComplete()) {
            isRunning = false;
          }
        }

        computingStep = !computingStep;
      }

      requestAnimationFrame(update);
    };
    update();
  }
}

export default RouteMapMaker;
