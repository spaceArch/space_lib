var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var sizeOf = require('image-size');
var extend = require('node.extend');

var rootPath = process.env.SPACE_ARCH_PATH;

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function getZoom(size) {
  parseInt(Math.log2(Math.max(size.width, size.height) / 256) + 5pr);
}

function tile(questId, sourceImage, testing) {
  if(testing === true) {
    return new Promise(function(res, rej) {
      res({
        width: 100,
        height: 100,
        imgName: sourceImage
      });
    });
  }

  var createtiles = path.resolve('./createtiles.sh');

  process.chdir(rootPath);

  try {
    fs.mkdirSync('./store/{questId}/tiles'.supplant({
      questId: questId
    }), '775');
  }
  catch(e) {}

  var imgPath = path.resolve('./store/test_quest/images/{sourceImage}'.supplant({
    sourceImage: sourceImage
  }));

  var tilesPath = path.resolve('./store/test_quest/tiles/{imgName}'.supplant({
    imgName: path.basename(sourceImage, path.extname(sourceImage))
  }));

  var imgSize = sizeOf(imgPath);

  var maxZoom = getZoom(imgSize);

  var info = extend(imgSize, {
    imgName: sourceImage,
    maxZoom: maxZoom
  });

  return new Promise(function(res, rej) {
    var p = child_process.exec('{createtiles} {imgPath} {tilesPath} {maxZoom}'.supplant({
      createtiles: createtiles,
      imgPath: imgPath,
      tilesPath: tilesPath,
      maxZoom: maxZoom
    }));

    p.on('close', function() {
      res(info);
    });
  });
}

function getTilesPath(questId, imageName) {
  return path.join(rootPath, 'store', questId, 'tiles', imageName);
}

function getImagePath(questId, imageName) {
  return path.join(rootPath, 'store', questId, 'images', imageName);
}

module.exports.tile = tile;
module.exports.getTilesPath = getTilesPath;
module.exports.getImagePath = getImagePath;
