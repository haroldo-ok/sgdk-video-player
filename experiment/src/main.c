#include <genesis.h>

#include "gfx.h"
#include "dma.h"

#include "generated/movie_res.h"

static u8    lineDisplay  = 0;          // line position on display screen
static fix16 lineGraphics = 0;          // line position in graphics texture
static fix16 scroll       = 0;          // scrolling offset
static fix16 scale        = FIX16(0.5); // scaling factor

void HIntHandler() {
    // Set line to display
    VDP_setVerticalScroll(BG_A, fix16ToInt(lineGraphics) - lineDisplay);

    // Determine next graphics line to display (+1 means image is unscaled)
    lineGraphics += scale;

    // Count raster lines
    lineDisplay++;

    // Decrease scaling factor each line
//    scale -= max(scale >> 6, FIX16(0.02));
}

void VIntHandler() {
	// Make sure HInt always starts with line 0
	lineDisplay = 0;

	// Reset first line we want to display
	lineGraphics = scroll;

	// Decrease scrolling offset, reset after 64 lines
//	scroll = (scroll - FIX16(1)) % FIX16(64);

	// Reset scaling factor
//	scale = FIX16(6.0);
}

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

    // Setup interrupt handlers
    SYS_disableInts();
    VDP_setScrollingMode(HSCROLL_PLANE, VSCROLL_PLANE);
    {
        VDP_setHIntCounter(0);
        VDP_setHInterrupt(1);
        SYS_setHIntCallback(HIntHandler);
        SYS_setVIntCallback(VIntHandler);
    }
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

			VDP_loadTileSet(frame->tileset, idx, DMA);
			TileMap *ctmap = unpackTileMap(frame->tilemap, NULL);
			
			VDP_waitVInt();
			
			SYS_disableInts();
			VDP_setPaletteColors(palIdx, (u16*)frame->palette->data, palIdx + 16);
			VDP_setTileMapEx(BG_A, ctmap, TILE_ATTR_FULL(palNum, FALSE, FALSE, FALSE, idx), 0, 0, 0, 0, frame->tilemap->w, frame->tilemap->h, DMA);			
			SYS_enableInts();

			MEM_free(ctmap);
			
			activeBuffer = !activeBuffer;
		}
		
        VDP_waitVInt();
    }

    return 0;
}



