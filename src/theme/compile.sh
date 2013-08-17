#!/bin/bash

# --style (compact|compressed|expanded)
STYLE=expanded

cd $(dirname $0)

sass black/black.scss --style $STYLE > ../../vanillabox/theme/black/vanillabox.css
