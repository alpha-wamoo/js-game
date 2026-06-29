#pragma once
#include <emscripten/emscripten.h>
#include <stdint.h>

extern uint8_t _callStackDepth;

#define IS_DEBUG 1
#define cdb(FN_NAME, MSG) ({ \
    if(IS_DEBUG){ \
        EM_ASM({ \
            console.log(`${UTF8ToString($0)} ${UTF8ToString($1)}`); \
        }, FN_NAME, MSG); \
    } \
})
#define cdb_call(FN_NAME) ({ \
    if(IS_DEBUG){ \
        EM_ASM({ \
            console.log(`${"  ".repeat($0)}${UTF8ToString($1)} : call ->`); \
        }, _callStackDepth++, FN_NAME); \
    } \
})
#define cdb_exit(FN_NAME) ({ \
    if(IS_DEBUG){ \
        EM_ASM({ \
            console.log(`${"  ".repeat($0)}${UTF8ToString($1)} : exit <-`); \
        }, --_callStackDepth, FN_NAME); \
    } \
})
#define cwarn(msg) ({ \
    if(IS_DEBUG){ \
        EM_ASM({ \
            console.warn(UTF8ToString($0)); \
        }, msg); \
    } \
})
#define clog(MSG) ({ \
    EM_ASM({ \
        console.log(UTF8ToString($0)); \
    }, MSG); \
})