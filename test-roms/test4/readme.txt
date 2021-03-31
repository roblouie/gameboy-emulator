I put together this demo as a first test of getting the Game Boy running.

In additon to the moving and firing spaceship from the test3 version of the
demo, this version adds a 32x64 tile sized background (twice the height of
the GB background map) which it scrolls by adding lines of tiles to the
background map just off-screen.  You can select the direction to scroll
the screen (up or down) by hitting the B-button.

It was tested using the TASM assembler and the NO$GMB emulator.

The "setpath.bat" batch file sets my compile paths to tasm.exe and rgbfix.exe.  The
"mk.bat" batch file runs my compile.


