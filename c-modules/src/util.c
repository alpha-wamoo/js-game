#include "../header/util.h"

bool util_chance(float p){
    return ((float)rand() / (float)RAND_MAX) < p;
}

float util_randomRate(){
    return (float)rand() / (float)RAND_MAX;
}