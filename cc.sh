#!/bin/bash

SRCS="c-modules/cmain.c c-modules/src/*.c"
FUNCTIONS='["_initGameContext"]'

emcc $SRCS \
  -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS=$FUNCTIONS \
  -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' \
  -s EXIT_RUNTIME=0 \
  -s ASSERTIONS=1 \
  -o cmodules.js