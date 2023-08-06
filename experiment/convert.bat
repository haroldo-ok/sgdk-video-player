rmdir /s /q tmpmv_test
md tmpmv_test
ffmpeg -i "Genesis does what Nintendon't - v2 HD by RVGM.mp4" -r 12 -s 256x112 tmpmv_test/frame_%%d.jpg
mogrify -path tmpmv_test -colors 16 -format png tmpmv_test\*.jpg
