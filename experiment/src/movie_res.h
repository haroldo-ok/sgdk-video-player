#ifndef _MOVIE_RES_H
#define _MOVIE_RES_H

#include <genesis.h>

typedef struct MovieData {
	u16 frameCount;
	const Image *frames[];
} MovieData;

#endif // _MOVIE_RES_H
