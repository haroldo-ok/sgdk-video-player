#include <genesis.h>

#include "gfx.h"
#include "sound.h"

#include "dma.h"

#include "movie_player.h"
#include "movie_HD_SEGA_logo_4x3_mp4.h"

extern const MovieData movie_HD_SEGA_logo_4x3_mp4;

int main(u16 hard) {
    while(TRUE) {
		MVP_playMovie(&movie_HD_SEGA_logo_4x3_mp4);
    }

    return 0;
}
