var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var sizeOf = require('image-size');
var extend = require('node.extend');
var im = require('imagemagick');
var Promise = require('promise');

var rootPath = process.env.SPACE_ARCH_PATH;
var rootPath = '/home/nd0ut/workspace/tiler/space_arch';

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function tile(questId, sourceImage, testing) {
  if(testing === true) {
    return new Promise(function(res, rej) {
      setTimeout(function() {
        res({
          width: 100,
          height: 100,
          imgName: sourceImage,
          maxZoom: 4
        });
      }, 5000);
    });
  }


  var createtiles = path.resolve('./createtiles.sh');

  process.chdir(rootPath);
  console.log('test');
  try {
    fs.mkdirSync('./store/quest_{questId}/tiles'.supplant({
      questId: questId
    }), '775');
  }
  catch(e) {}

  var imgPath = path.resolve('./store/quest_{questId}/images/{sourceImage}'.supplant({
    sourceImage: sourceImage,
    questId: questId
  }));

  var tilesPath = path.resolve('./store/quest_{questId}/tiles/{imgName}'.supplant({
    imgName: sourceImage,
    questId: questId
  }));

  var imgSize = sizeOf(imgPath);

  Math.log2 = Math.log2 || function(x) {
    return Math.log(x) / 0.6931471805599453;
  };

  var maxZoom = parseInt(Math.log2(Math.max(imgSize.width, imgSize.height) / 256) + 3)

  var info = extend(imgSize, {
    imgName: sourceImage,
    maxZoom: maxZoom
  });

  return new Promise(function(res, rej) {
    var cmd = '{createtiles} {imgPath} {tilesPath} {maxZoom}'.supplant({
      createtiles: createtiles,
      imgPath: imgPath,
      tilesPath: tilesPath,
      maxZoom: maxZoom
    });

    var p = child_process.exec(cmd);
    console.log(cmd);

    p.on('close', function() {
      res(info);
    });
  });
}

function getTilesPath(questId, imageName) {
  return path.relative(rootPath, path.join(rootPath, 'store', 'quest_' + questId, 'tiles', imageName));
}

function getImagePath(questId, imageName) {
  return path.relative(rootPath, path.join(rootPath, 'store', 'quest_' + questId, 'images', imageName));
}

function getThumbPath(questId, imageName) {
  return path.relative(rootPath, path.join(rootPath, 'store', 'quest_' + questId, 'images', imageName + '.thumb.jpg'));
}

function createThumb(questId, imageName) {
  process.chdir(rootPath);

  var image = path.resolve(getImagePath(questId, imageName));
  var thumb = path.resolve(getImagePath(questId, imageName) + '.thumb.jpg');



  return new Promise(function(res, rej) {
    im.convert([image, '-thumbnail', '512x512', thumb], function(err, out) {
      if (err) throw err;

      res(thumb);
    });
  });
}

module.exports.tile = tile;
module.exports.getTilesPath = getTilesPath;
module.exports.getImagePath = getImagePath;
module.exports.createThumb = createThumb;
