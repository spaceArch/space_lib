# Using
- add to package.json
`"space_lib": "git://github.com/spaceArch/space_lib.git#master"`

- require
`var space = require('space');`


# Api
## tile(questId, sourceImage, isTesting)
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

