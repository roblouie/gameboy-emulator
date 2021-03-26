; Game Boy test
; opus@dnai.com

;---------------------------------------------------------------------
; this version of the test sets up the gameboy, and then loads and
; runs a simple scrolling background
;---------------------------------------------------------------------


; GAMEBOY SYSTEM CONSTANTS
; the hardware registers for the Game Boy begin at address $FF00
; All the 8 bit register addresses below are offsets relative to $FF00
#define		JOYPAD_REGISTER			$00		; joypad
#define			PAD_PORT_DPAD		%00100000	; select d-pad buttons
#define			PAD_PORT_BUTTONS	%00010000	; select other buttons
#define			PAD_OUTPUT_MASK		%00001111	; mask for the output buttons
#define			DPAD_DOWN			7
#define			DPAD_UP				6
#define			DPAD_LEFT			5
#define			DPAD_RIGHT			4
#define			START_BUTTON		3
#define			SELECT_BUTTON		2
#define			B_BUTTON			1
#define			A_BUTTON			0
#define			DPAD_DOWN_MASK		%10000000
#define			DPAD_UP_MASK		%01000000
#define			DPAD_LEFT_MASK		%00100000
#define			DPAD_RIGHT_MASK		%00010000
#define			START_BUTTON_MASK	%00001000
#define			SELECT_BUTTON_MASK	%00000100
#define			B_BUTTON_MASK		%00000010
#define			A_BUTTON_MASK		%00000001

#define		DIV_REGISTER			$04		; divide timer... read to get time, write to reset it to 0
#define		TIMA_REGISTER			$05		; main timer... freq is set in TAC reg, generates interupt when overflows
#define		TMA_REGISTER			$06		; Timer Modulo... main timer loaded with this value after it overflows
#define		TAC_REGISTER			$07		; Timer Control
#define			TIMER_STOP			%00000100	; timer halt flag... 0=stop, 1=run
#define			TIMER_FREQ_MASK		%00000011	; mask for timer frequency bits
#define			  TIMER_FREQ_4KHz	%00000000	; main timer runs at 4.096 KHz
#define			  TIMER_FREQ_262KHz	%00000001	; main timer runs at 262.144 KHz
#define			  TIMER_FREQ_65KHZ	%00000010	; main timer runs at 65.536 KHz
#define			  TIMER_FREQ_16KHz	%00000011	; main timer runs at 15.384 KHz

#define		IRQ_FLAG_REGISTER		$0F		; Interrupt Flag
#define			VBLANK_INT			%00000001	; bit 0 = vblank interrupt on/off
#define			LCDC_INT			%00000010	; bit 1 = LCDC interrupt on/off
#define			TIMER_INT			%00000100	; bit 2 = Timer Overflow interrupt on/off
#define			SERIAL_INT			%00001000	; bit 3 = Serial I/O Transfer Completion interrupt on/off
#define			CONTROLLER_INT		%00010000	; bit 4 = ??

#define		LCDC_CONTROL			$40		; LCD (Graphics) Control
#define			BKG_DISP_FLAG		%00000001	; bit 0 = background tile map is on if set
#define         SPRITE_DISP_FLAG	%00000010	; bit 1 = sprites are on if set
#define			SPRITE_DISP_SIZE	%00000100	; bit 2 = sprite size (0=8x8 pixels, 1=16x8)
#define			BKG_MAP_LOC			%00001000	; bit 3 = background tile map location (0=$9800-$9bff, 1=$9c00-$9fff)
#define			TILES_LOC			%00010000	; bit 4 = tile data location (0=$8800-$97ff, 1=$8000-$8fff)
#define			WINDOW_DISP_FLAG	%00100000	; bit 5 = window tile map is on if set
#define			WINDOW_MAP_LOC		$01000000	; bit 6 = window tile map location (0=$9800-$9bff, 1=$9c00-9fff)
#define			DISPLAY_FLAG		%10000000	; bit 7 = LCD display on if set
#define		LCDC_STATUS				$41		; LCDC Status
#define			DISP_CYCLE_MODE		%00000011	; mask for the display cycle mode bits
#define			  VBLANK_MODE		%00000000	; system is in vertical blanking interval
#define			  HBLANK_MODE		%00000001	; system is in a horizontal blanking interval
#define			  SPRITE_MODE		%00000010	; system is reading sprite RAM
#define			  LCD_TRANSFER		%00000011	; system is transfering data to the LCD driver

#define		SCROLL_BKG_Y			$42		; vertical scroll position of background tile map
#define		SCROLL_BKG_X			$43		; horizontal scroll position of background tile map

#define		LCDC_LY_COUNTER			$44		; increments every scan line (0..143 = display, 144-153 = vblank)
#define		LY_COMPARE				$45		; ??

#define		DMA_REGISTER			$46		; DMA Transfer and Start Address

#define		PALETTE_BKG				$47		; palette data for background tile map
#define		PALETTE_SPRITE_0		$48		; sprite palette 0 data
#define		PALETTE_SPRITE_1		$49		; sprite palette 1 data

#define		POS_WINDOW_Y			$4A		; window tile map Y position
#define		POS_WINDOW_X			$4B		; window tile map X position

#define		INTERRUPT_ENABLE		$ff		; Interrupt Enable

; $ff80 to $fffe is 128 bytes of internal RAM
#define		STACK_TOP				$fff4		; put the stack here

; video ram display locations
#define		TILES_MEM_LOC_0			$8800		; tile map tiles only
#define		TILES_MEM_LOC_1			$8000		; tile maps and sprite tiles

#define		MAP_MEM_LOC_0			$9800		; background and window tile maps
#define		MAP_MEM_LOC_1			$9c00		; (select which uses what mem loc in LCDC_CONTROL register)

#define		SPRITE_ATTRIB_MEM_LOC	$fe00		; OAM memory (sprite attributes)

; sprite attribute flags
#define		SPRITE_FLAGS_PAL		%00010000	; palette (0=sprite pal 0, 1=sprite pal 1)
#define		SPRITE_FLAGS_XFLIP		%00100000	; sprite is horizontal flipped
#define		SPRITE_FLAGS_YFLIP		%01000000	; sprite is vertical flipped
#define		SPRITE_FLAGS_PRIORITY	$10000000	; sprite display priority (0=on top bkg & win, 1=behind bkg & win)



;-------------------------------------------------------------------------
; start of the game rom (address 0000)
;-------------------------------------------------------------------------
.org $0000

; NOTE: the hardware requires the interrupt jumps to be at these addresses

.org $0040
; Vertical Blanking interrupt
	jp	VBlankFunc

.org $0048
; LCDC Status interrupt (can be set for H-Blanking interrupt)
	reti

.org $0050
; Main Timer Overflow interrupt
	reti

.org $0058
; Serial Transfer Completion interrupt
	reti

.org $0060
; Joypad Button Interrupt?????
	reti




.org $0100
; begining of Game Boy game header
	nop
	jp 		$150         ; goto beginning of game code

; Game Boy standard header... DO NOT CHANGE!
.db $CE,$ED,$66,$66,$CC,$0D,$00,$0B,$03,$73,$00,$83,$00,$0C,$00,$0D
.db $00,$08,$11,$1F,$88,$89,$00,$0E,$DC,$CC,$6E,$E6,$DD,$DD,$D9,$99
.db $BB,$BB,$67,$63,$6E,$0E,$EC,$CC,$DD,$DC,$99,$9F,$BB,$B9,$33,$3E

.db "Opus Test       "	; game name (must be 16 bytes)
.db $00,$00,$00			; unused
.db $00					; cart type
.db $00					; ROM Size (32 k)
.db $00					; RAM Size (0 k)
.db $00,$00				; maker ID
.db $01					; Version     =1
.db $DA					; Complement check (Important)
.db $ff,$ff				; Cheksum, needs to be calculated!



.org $0150
; begining of game code
start
	; init the stack pointer
	ld		sp, STACK_TOP

	; enable only vblank interrupts
	ld		a, VBLANK_INT			; set vblank interrupt bit
	ldh		(INTERRUPT_ENABLE), a	; load it to the hardware register

	; standard inits
	sub		a	;	a = 0
	ldh		(LCDC_STATUS), a	; init status
	ldh		(LCDC_CONTROL), a	; init LCD to everything off
	ldh		(SCROLL_BKG_X), a	; background map will start at 0,0
	ldh		(SCROLL_BKG_Y), a

	; load the tiles
	ld		bc, TileData
	call	LoadTiles

	; load the background map
	ld		bc, BkgMapData
	call	LoadMapToBkg

	; init the palettes
	call	InitPalettes

	; set display to on, background on, window off, sprites off, sprite size 8x8
	;	tiles at $8000, background map at $9800, window map at $9C00
	ld		a, DISPLAY_FLAG + BKG_DISP_FLAG + TILES_LOC + WINDOW_MAP_LOC
	ldh		(LCDC_CONTROL),a

	; allow interrupts to start occuring
	ei

; main game loop
Game_Loop
; time to loop!
	jp		Game_Loop




;----------------------------------------------------
; load the tiles from ROM into the tile video memory
;
; IN:	bc = address of tile data to load
;----------------------------------------------------
LoadTiles
	ld		hl, TILES_MEM_LOC_1	; load the tiles to tiles bank 1

	ld		de, 4 * 16
	ld		d, $10  ; 16 bytes per tile
	ld		e, $05  ; number of tiles to load

load_tiles_loop
	; only write during
	ldh		a, (LCDC_STATUS)	; get the status
	and		SPRITE_MODE			; don't write during sprite and transfer modes
	jr		nz, load_tiles_loop

	ld		a, (bc)		; get the next value from the source
	ld		(hli), a	; load the value to the destination, incrementing dest. ptr
	inc		bc			; increment the source ptr

	; now loop de times
	dec		d
	jp		nz, load_tiles_loop
	dec		e
	jp		nz, load_tiles_loop

	ret



;----------------------------------------------------
; load the tile map to the background
;
; IN:	bc = address of map to load
;----------------------------------------------------
LoadMapToBkg
	ld		hl, MAP_MEM_LOC_0	; load the map to map bank 0

	ld		d, $00	; 256 bytes per "block"
	ld		e, $04	; 4 blocks (32x32 tiles, 1024 bytes)

load_map_loop
	; only write during
	ldh		a, (LCDC_STATUS)	; get the status
	and		SPRITE_MODE			; don't write during sprite and transfer modes
	jr		nz, load_map_loop

	ld		a, (bc)		; get the next value from the source
	ld		(hli), a	; load the value to the destination, incrementing dest. ptr
	inc		bc			; increment the source ptr

	; now loop de times
	dec		d
	jp		nz, load_map_loop
	dec		e
	jp		nz, load_map_loop

	ret




;----------------------------------------------------
; init the palettes to basic
;----------------------------------------------------
InitPalettes
	ld		a, %11100100	; set palette colors

	; load it to all the palettes
	ldh		(PALETTE_BKG), a
	ldh		(PALETTE_SPRITE_0), a
	ldh		(PALETTE_SPRITE_1), a

	ret



;---------------------------------------------------
; my vblank routine - do all graphical changes here
; while the display is not drawing
;---------------------------------------------------
VBlankFunc
	di		; disable interrupts
	push	af

	; increment my little timer
	ld		a, (ScrollTimer)			; get the scroll timer
	inc		a					; increment it
	ld		(ScrollTimer), a

	; is it time to scroll yet?
	and		%00000111			; only do scroll every 8th vblank
	jr		nz, vblank_end

vblank_do_scroll
	; do a background screen scroll
	ldh		a, (SCROLL_BKG_X)		; scroll the background horiz one bit
	inc		a
	ldh		(SCROLL_BKG_X), a

vblank_end
	pop af
	ei		; enable interrupts
	reti	; and done




; tiles are here
TileData
#include "tgTiles.dat"

; map is here
BkgMapData
; 32x32 tiles
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03
.db		$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03,$04,$03




;-------------------------------------------------------------------------
; Internal RAM... store dynamic data here
;-------------------------------------------------------------------------
.org $c000

; temp variables
ScrollTimer
.db		$00		; temp variable for slowing down scroll speed






.block $008000-$
.end start

