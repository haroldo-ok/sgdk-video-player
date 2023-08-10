rmdir /s /q tmpmv_test
md tmpmv_test
ffmpeg -i "Genesis does what Nintendon't - v2 HD by RVGM.mp4" -r 12 -s 256x224 tmpmv_test/frame_%%d.jpg
node --max-old-space-size=4096 reduce.js
mogrify -path tmpmv_test -colors 16 -format png tmpmv_test\*.png
node generator.js

