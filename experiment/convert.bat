rmdir /s /q tmpmv_test
md tmpmv_test
ffmpeg -i "Genesis does what Nintendon't - v2 HD by RVGM.mp4" -r 12 -s 320x224 tmpmv_test/frame_%%d.jpg  -ar 22050 -ac 1 -acodec pcm_u8 tmpmv_test/sound.wav
node --max-old-space-size=4096 reduce.js
mogrify -path tmpmv_test -colors 16 -format png tmpmv_test\*.png
node generator.js

