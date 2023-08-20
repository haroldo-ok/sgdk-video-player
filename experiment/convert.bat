rem rmdir /s /q tmpmv_test
rem md tmpmv_test
rem ffmpeg -i "Genesis does what Nintendon't - v2 HD by RVGM.mp4" -r 12 -s 320x224 tmpmv_test/frame_%%d.jpg  -ar 22050 -ac 1 -acodec pcm_u8 tmpmv_test/sound.wav
rem node --max-old-space-size=4096 reduce.js
rem mogrify -path tmpmv_test -colors 16 -format png tmpmv_test\*.png
rem node generator.js

node ../ convert "HD SEGA logo 4x3.mp4" tmpaaaaa
