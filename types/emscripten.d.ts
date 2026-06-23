declare namespace Emscripten {
    interface Module {
        onRuntimeInitialized?: () => void;
        cwrap: (ident: string, returnType: string, argTypes: string[]) => (...args: any[]) => any;
        ccall: (ident: string, returnType: string, argTypes: string[], args: any[]) => any;
        HEAP8?: Int8Array;
        HEAP16?: Int16Array;
        HEAP32?: Int32Array;
        HEAPF32?: Float32Array;
        HEAPF64?: Float64Array;
        _malloc?: (size: number) => number;
        _free?: (ptr: number) => void;
    }
}

declare const Module: Emscripten.Module;
export = Module;
export as namespace Module;
