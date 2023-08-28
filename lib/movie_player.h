#ifndef _MOVIE_RES_H
#define _MOVIE_RES_H

#include <genesis.h>

typedef struct MovieData {
	u16 format;
	u16 w, h;
	u16 frameCount;
	const u8 *sound;
	const u32 soundLen;
	const Image *frames[];
} MovieData;

extern void MVP_playMovie(const MovieData *movie);

#endif // _MOVIE_RES_H
