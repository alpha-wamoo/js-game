#!/bin/bash

SRCS="c-modules/cmain.c c-modules/src/Vector2.c c-modules/src/RGB.c"
FUNCTIONS='["_init"]'

emcc $SRCS \
  -O3 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORTED_FUNCTIONS=$FUNCTIONS \
  -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' \
  -o cmodules.js

# emcc c-modules/cmodules.cpp \
#   -o cmodules.js \
#   -s WASM=1 \
#   -s MODULARIZE=1 \
#   -s EXPORT_ES6=1 \
#   -s EXPORTED_FUNCTIONS=$FUNCTIONS \
#   -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]' \
#   -std=c++20
