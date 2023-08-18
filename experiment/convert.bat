del out\res\* /q
rmdir /s /q tmpmv_test
md tmpmv_test

ffmpeg -i "HD SEGA logo 4x3.mp4" -r 12 -s 320x224 tmpmv_test/frame_%%d.jpg  -ar 22050 -ac 1 -acodec pcm_u8 tmpmv_test/sound.wav
node --max-old-space-size=4096 reduce.js
mogrify -path tmpmv_test -colors 16 -format png tmpmv_test\*.png
node generator.js

rem magick tmpmv_test\frame_19.jpg tmpmv_test\frame_20.jpg -append tmpmv_test\frames_19_to_20.png
rem npx rgbquant-sms convert --colors=16 --max-tiles=512 --dith-kern=Ordered2x1 tmpmv_test\frames_19_to_20.png tmpmv_test\frames_19_to_20b.pngpx rgbquant-sms convert tmpmv_test\frames_19_to_20.png tmpmv_test\frames_19_to_20b.png
rem npx rgbquant-sms convert --colors=16 --max-tiles=512 --dith-kern=Ordered2x1 tmpmv_test/rawframes_1_to_2.png tmpmv_test/frames_1_to_2.png