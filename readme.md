# DEPRECATED
## Use the desktop version [Inrixia/neptune-plugins](https://github.com/Inrixia/neptune-plugins)

# TidalTags Browser Extension
TidalTags is a Chrome/Firefox extension that adds quality tags to songs in the Tidal Web Player.

This is very much not polished and is only really intended to be used as a reference for testing.

## Install
1. Download the extension zip for your browser from https://github.com/Inrixia/TidalTags/releases/tag/latest
2. Unzip the files into a folder.
3. Install the extension:  
For **Chrome** go to `chrome://extensions/` make sure `Developer mode` in the top right is on. Click `Load unpacked` in the top left and select the folder with the extracted files.  
For **Firefox** go to `about:debugging#/runtime/this-firefox` and click `Load Temporary Add-on`, select any file in the folder of extracted files. 
4. Open dev-tools on the Tidal Web App and copy the Authorization header off any request:  
![image](https://github.com/Inrixia/TidalTags/assets/6373693/c5d15b5c-68ba-4f49-a37b-bb6614ca65b4)
5. Paste it into the extension settings:  
![image](https://github.com/Inrixia/TidalTags/assets/6373693/4ebd3884-544b-47bb-9046-37863cff4fb8)
6. Go browse the Web Player! Everything should be working.

Notes: 
- Firefox forces unsigned extensions to uninstall every browser restart, I dont think there is a way around this so sucks to not use chrome I guess... If there is a way around this please open a PR or issue about how to install it so it persists.
- The token needed does and will expire, if things arent working try refresh and grab the token again.


## Example Screenshot:
![image](https://github.com/Inrixia/TidalTags/assets/6373693/ee98b001-33c5-4f30-9fd6-8bf54ba2d2c5)

