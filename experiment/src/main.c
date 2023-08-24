#include <genesis.h>

#include "gfx.h"
#include "sound.h"

#include "dma.h"

#include "movie_res.h"
#include "movie_HD_SEGA_logo_4x3_mp4.h"

/// Counter to be incremented by background task
static volatile uint32_t hwFrameCount = 0;

extern const MovieData movie_HD_SEGA_logo_4x3_mp4;

void VIntHandler() {
	hwFrameCount++;
}

int main(u16 hard)
{
    // disable interrupt when accessing VDP
    SYS_disableInts();
	
	// workaround to tiles leaking into PLAN A
	VDP_setBPlanAddress(VDP_getAPlanAddress());

    // set all palette to black
    VDP_setPaletteColors(0, (u16*) palette_black, 64);

	// Set up frame counter
	SYS_setVIntCallback(VIntHandler);

    // VDP process done, we can re enable interrupts
    SYS_enableInts();
	
	bool activeBuffer = FALSE;
	u16 idx1 = TILE_USERINDEX;
	u16 idx2 = idx1 + movie_HD_SEGA_logo_4x3_mp4.w * movie_HD_SEGA_logo_4x3_mp4.h;
	
	u16 videoFrameRate = 12;
	u16 systemFrameRate = IS_PALSYSTEM ? 50 : 60;

    while(TRUE)
    {
		u16 videoFrame = 0;

		SYS_disableInts();
		hwFrameCount = 0;
		SYS_enableInts();

		SND_startPlay_2ADPCM(movie_HD_SEGA_logo_4x3_mp4.sound, movie_HD_SEGA_logo_4x3_mp4.soundLen, SOUND_PCM_CH1, FALSE);
		
		while (videoFrame < movie_HD_SEGA_logo_4x3_mp4.frameCount) {
			const Image *frame = movie_HD_SEGA_logo_4x3_mp4.frames[videoFrame];
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
				uint32_t frameCount = hwFrameCount;
				SYS_enableInts();
				
				videoFrame = frameCount * videoFrameRate / systemFrameRate;
				if (videoFrame == previousVideoFrame) {
					VDP_waitVInt();
				}
			}
		}
		
        VDP_waitVInt();
    }

    return 0;
}
