#!/bin/bash

SRCS="c-modules/cmain.c c-modules/src/*.c"
FUNCTIONS='["_init","_loadAllJsons"]'

emcc $SRCS \
  -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS=$FUNCTIONS \
  -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' \
  -o cmodules.js