# Using
- add to package.json
`"space_lib": "git://github.com/spaceArch/space_lib.git#master"`

- require
`var space = require('space');`


# Api
## tile(questId, sourceImage, isTesting)
Тайлит картинку, возвращает промис с параметрами
```
space.tile('questId', 'sourceImage.jpg', true).then(function(res) {
        console.log(res);
    });

>> { 
  width: 100,
  height: 100,
  imgName: 'sourceImage.jpg',
  maxZoom: 4 
}
```
## getTilesPath(questId, image)
Возвращает относительный путь до тайлов 
```
getTilesPath('test_quest', 'image.jpg')
>> /www/space_arch/store/test_quest/tiles/image.jpg
```
## getImagePath(questId, image)
Возвращает относительный путь до картинки
```
getImagePath('test_quest', 'image.jpg')
>> /www/space_arch/store/test_quest/images/image.jpg
```
## getThumbPath(questId, image)
Возвращает относительный путь до превью
```
getImagePath('test_quest', 'image.jpg')
>> /www/space_arch/store/test_quest/images/image.thumb.jpg
```
## createThumb(questId, image)
Создаёт превью, возвращает промис с путём до превью
```
createThumb('test_quest', 'image.jpg')
```
