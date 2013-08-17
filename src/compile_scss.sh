#!/bin/bash

# --style (compact|compressed|expanded)
STYLE=expanded

cd $(dirname $0)

sass theme/bitter/bitter.scss --style $STYLE > ../vanillabox/theme/bitter/vanillabox.css
sass theme/bitter_frame/bitter_frame.scss --style $STYLE > ../vanillabox/theme/bitter_frame/vanillabox.css
