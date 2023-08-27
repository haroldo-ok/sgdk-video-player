#include <genesis.h>

#include "movie_player.h"

/// Counter to be incremented by background task
static volatile uint32_t movieFrameCount = 0;

void MVP_VIntHandler() {
	movieFrameCount++;
}

void MVP_playMovie(const MovieData *movie) {
    // disable interrupt when accessing VDP
    SYS_disableInts();
	
	// workaround to tiles leaking into PLAN A
	VDP_setBPlanAddress(VDP_getAPlanAddress());

    // set all palette to black
    VDP_setPaletteColors(0, (u16*) palette_black, 64);

	// Set up frame counter
	SYS_setVIntCallback(MVP_VIntHandler);

    // VDP process done, we can re enable interrupts
    SYS_enableInts();
	
	bool activeBuffer = FALSE;
	u16 idx1 = TILE_USERINDEX;
	u16 idx2 = idx1 + movie->w * movie->h;
	
	u16 videoFrameRate = 12;
	u16 systemFrameRate = IS_PALSYSTEM ? 50 : 60;

	u16 videoFrame = 0;

	SYS_disableInts();
	movieFrameCount = 0;
	SYS_enableInts();

	SND_startPlay_2ADPCM(movie->sound, movie->soundLen, SOUND_PCM_CH1, FALSE);
	
	while (videoFrame < movie->frameCount) {
		const Image *frame = movie->frames[videoFrame];
		u16 idx = activeBuffer ? idx1 : idx2;
		u16 palNum = activeBuffer ? PAL0 : PAL1;
		u16 palIdx = activeBuffer ? 0 : 16;

		VDP_loadTileSet(frame->tileset, idx, DMA_QUEUE);
		
		TileMap *ctmap = unpackTileMap(frame->tilemap, NULL);
		VDP_setTileMapEx(BG_A, ctmap, TILE_ATTR_FULL(palNum, FALSE, FALSE, FALSE, idx), 0, 0, 0, 0, frame->tilemap->w, frame->tilemap->h, DMA_QUEUE);
		
		VDP_waitVInt();
		
		DMA_flushQueue();
		VDP_setPaletteColors(palIdx, (u16*)frame->palette->data, palIdx + 16);
		MEM_free(ctmap);
		
		activeBuffer = !activeBuffer;
		
		// Waits for next video frame
		
		u16 previousVideoFrame = videoFrame;
		while (videoFrame == previousVideoFrame) {
			SYS_disableInts();
			uint32_t frameCount = movieFrameCount;
			SYS_enableInts();
			
			videoFrame = frameCount * videoFrameRate / systemFrameRate;
			if (videoFrame == previousVideoFrame) {
				VDP_waitVInt();
			}
		}
	}
	
	VDP_waitVInt();

	// Remove frame counter
    SYS_disableInts();
	SYS_setVIntCallback(NULL);
	SYS_enableInts();
}
