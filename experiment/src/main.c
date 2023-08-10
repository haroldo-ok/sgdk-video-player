#include <genesis.h>

#include "gfx.h"
#include "dma.h"

#include "generated/movie_res.h"

int main(u16 hard)
{
    // disable interrupt when accessing VDP
    SYS_disableInts();
    // initialization
    VDP_setScreenWidth256();

    // set all palette to black
    VDP_setPaletteColors(0, (u16*) palette_black, 64);

    // VDP process done, we can re enable interrupts
    SYS_enableInts();
	
	bool activeBuffer = FALSE;
	u16 idx1 = TILE_USERINDEX;
	u16 idx2 = idx1 + movie_test.frames[0]->tilemap->w * movie_test.frames[0]->tilemap->h;

    while(TRUE)
    {
		for (u16 frameNumber = 0; frameNumber != movie_test.frameCount; frameNumber++) {
			const Image *frame = movie_test.frames[frameNumber];
			u16 idx = activeBuffer ? idx1 : idx2;
			u16 palNum = activeBuffer ? PAL0 : PAL1;
			u16 palIdx = activeBuffer ? 0 : 16;

			VDP_loadTileSet(frame->tileset, idx, DMA_QUEUE);
			DMA_flushQueue();
			
			TileMap *ctmap = unpackTileMap(frame->tilemap, NULL);
			VDP_setTileMapEx(BG_A, ctmap, TILE_ATTR_FULL(palNum, FALSE, FALSE, FALSE, idx), 0, 0, 0, 0, frame->tilemap->w, frame->tilemap->h, DMA_QUEUE);
			
			VDP_waitVInt();
			
			DMA_flushQueue();
			VDP_setPaletteColors(palIdx, (u16*)frame->palette->data, palIdx + 16);
			MEM_free(ctmap);
			
			activeBuffer = !activeBuffer;
		}
		
        VDP_waitVInt();
    }

    return 0;
}
