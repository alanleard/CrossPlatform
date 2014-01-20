CrossPlatform
=============

This is a simple project that intends to continue to build example use cases that work across all Appcelerator supported platforms.

Current Known Issues
====================

BlackBerry
——————————
To get ti.cloud to work you need to manually include the ti.cloud modules in the assets directory of the blackberry build folder (build/blackberry/assets/ti.cloud.js)

Also ti.cloud.js currently needs to be modified:

find: e="production"==Ti.App.deployType.toLowerCase()?"production":"development"
replace: e=Ti.App.deployType && "production"==Ti.App.deployType.toLowerCase()?"production":"development"