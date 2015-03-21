#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd
./gdal2tiles.py -l -p raster -z 0-$3 -w none $1 $2
