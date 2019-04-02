#!/bin/bash
export APP="brewapp.zip"
echo $APP
rm $APP
find . -name "*" -type f -print | grep -v .git | grep -v webx | grep -v .idea | grep -v mapbox_cache |  grep -v node_modules | zip $APP -@
adb shell mkdir /sdcard/Android/Data/letworks.brewery/files/
adb push $APP /sdcard/Android/Data/letworks.brewery/files/
mv $APP ..
