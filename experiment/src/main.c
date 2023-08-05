#include <genesis.h>

#include "gfx.h"
#include "dma.h"

#include "generated/movie_res.h"

int main(u16 hard)
{
    u16 ind;

    // disable interrupt when accessing VDP
    SYS_disableInts();
    // initialization
    VDP_setScreenWidth256();

    // set all palette to black
    VDP_setPaletteColors(0, (u16*) palette_black, 64);

    // load background tilesets in VRAM
    ind = TILE_USERINDEX;
    int idx1 = ind;
    VDP_loadTileSet(logo_aplib.tileset, ind, DMA);
    ind += logo_aplib.tileset->numTile;
    int idx2 = ind;
//    VDP_loadTileSet(frame_94.tileset, ind, DMA);
    ind += frame_94.tileset->numTile;

    // This one is not packed
    //TileMap *utmap = logo_ucomp.tilemap;
    // Unpack the packed tilemap
    TileMap *ctmap = unpackTileMap(logo_aplib.tilemap, NULL);

    // draw backgrounds
    VDP_setTileMapEx(BG_A, ctmap, TILE_ATTR_FULL(PAL0, FALSE, FALSE, FALSE, idx1), 0, 0,  0, 0, 30, 12, DMA);
//    VDP_setTileMapEx(BG_A, frame_94.tilemap, TILE_ATTR_FULL(PAL1, FALSE, FALSE, FALSE, idx2), 0, 12, 0, 0, frame_94.tilemap->w, frame_94.tilemap->h, DMA);

    VDP_setPaletteColors(0,  (u16*)logo_aplib.palette->data, 16);
//	VDP_setPaletteColors(16, (u16*)frame_94.palette->data, 32);

    // VDP process done, we can re enable interrupts
    SYS_enableInts();

    while(TRUE)
    {
		for (u16 frameNumber = 0; frameNumber != movie_test.frameCount; frameNumber++) {
			const Image *frame = movie_test.frames[frameNumber];

			VDP_waitVInt();
			VDP_loadTileSet(frame->tileset, idx2, DMA);
			VDP_setTileMapEx(BG_A, frame->tilemap, TILE_ATTR_FULL(PAL1, FALSE, FALSE, FALSE, idx2), 0, 12, 0, 0, frame->tilemap->w, frame->tilemap->h, DMA);
			VDP_setPaletteColors(16, (u16*)frame->palette->data, 32);
		}
		
        VDP_waitVInt();
    }

    return 0;
}



