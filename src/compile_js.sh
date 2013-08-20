#!/bin/bash
# TODO: Replace it with Grunt task


# $COMPILER_JAR: Path of Google Closure Compiler
#
# See following page for more information:
# https://developers.google.com/closure/compiler/


# --compilation_level (WHITESPACE_ONLY|SIMPLE_OPTIMIZATIONS|ADVANCED_OPTIMIZATIONS)
COMPILATION_LEVEL=SIMPLE_OPTIMIZATIONS


cd $(dirname $0)

java -jar $COMPILER_JAR --js ../vanillabox/jquery.vanillabox.js --compilation_level $COMPILATION_LEVEL --js_output_file ../vanillabox/jquery.vanillabox-min.js
