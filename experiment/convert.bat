rmdir /s /q tmpmv_test
md tmpmv_test
ffmpeg -i "Genesis does what Nintendon't - v2 HD by RVGM.mp4" -r 12 -s 256x114 tmpmv_test/frame_%%d.jpg
