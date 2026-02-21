import {assert, beforeEach, describe, expect, it} from "vitest";
import {CpuRegister, DoubleCpuRegister} from "@/cpu/internal-registers/cpu-register";
import {CPU} from "@/cpu/cpu";
import {Memory} from "@/memory/memory";
import {InterruptController} from "@/cpu/interrupt-request-register";
import {TimerController} from "@/cpu/timer-controller";
import {GPU} from "@/gpu/gpu";
import {APU} from "@/apu/apu";

const SingleCycleInstructionCount = 4;
const TwoCycleInstructionCount = 8;

describe("Operations clock cycles matching their cycle time", () => {
  let cyclesClocked = 0;
  let cpu = new CPU(new Memory(new GPU(new InterruptController()), new APU(), new InterruptController(), new TimerController(new InterruptController())), new InterruptController(), new TimerController(new InterruptController()), (tCycles) => {
    cyclesClocked += tCycles;
  });

  function expectMatchingCycleTime(value: number) {
    cpu.memory.writeByte(0x8000, value);

    const cycles = cpu.tick();
    expect(cycles).toBe(cyclesClocked);
  }

  function expectCycleTimeToBe(instructionByte: number, expectedCycles: number) {
    cpu.memory.writeByte(0x8000, instructionByte);

    const cycles = cpu.tick();
    expect(cycles).toBe(expectedCycles);
  }

  beforeEach(() => {
    cyclesClocked = 0;
    cpu = new CPU(new Memory(new GPU(new InterruptController()), new APU(), new InterruptController(), new TimerController(new InterruptController())), new InterruptController(), new TimerController(new InterruptController()), (tCycles) => {
      cyclesClocked += tCycles;
    });
    cpu.registers.programCounter.value = 0x8000;
    cpu.registers.HL.value = 0x8000;
  });

  // ADD
  it.each(cpu.registers.baseRegisters)("ADD A, $name", (register: CpuRegister) => {
    expectMatchingCycleTime(0b10000000 + register.code);
  });
  it("ADD A, N", () => expectMatchingCycleTime(0b11_000_110));
  it('ADD A, (HL)', () => expectMatchingCycleTime(0b10_000_110));
  it.each(cpu.registers.baseRegisters)('ADC A, $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10001000 + register.code);
  });
  it('ADC A, 0xAA', () => expectMatchingCycleTime(0b11_001_110));
  it('ADC A, (HL)', () => expectMatchingCycleTime(0b10_001_110));
  it.each(cpu.registers.registerPairs.filter(registerPair => registerPair.name !== 'AF'))('ADC HL, $name', (register: CpuRegister) => {
    expectMatchingCycleTime((register.code << 4) + 0b1001);
  });
  it('ADD SP, 0xAA', () => expectMatchingCycleTime(0b11_101_000));

  // DEC
  it.each(cpu.registers.baseRegisters)('DEC $name', (register: CpuRegister) => {
    expectMatchingCycleTime((register.code << 3) + 0b101);
  });
  it('DEC (HL)', () => expectMatchingCycleTime(0b00_110_101));
  it.each(cpu.registers.registerPairs.filter(registerPair => registerPair.name !== 'AF'))('DEC $name', (register: CpuRegister) => {
    expectMatchingCycleTime((register.code << 4) + 0b1011);
  });

  // INC
  it.each(cpu.registers.baseRegisters)('INC $name', (register: CpuRegister) => {
    expectMatchingCycleTime((register.code << 3) + 0b100);
  });
  it('INC (HL)', () => expectMatchingCycleTime(0b00_110_100));
  it.each(cpu.registers.registerPairs.filter(registerPair => registerPair.name !== 'AF'))('INC $name', (register: DoubleCpuRegister) => {
    expectMatchingCycleTime((register.code << 4) + 0b0011);
  });

  // SUB
  it.each(cpu.registers.baseRegisters)('SUB $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_010_000 + register.code);
  });
  it('SUB 0xnn', () => expectMatchingCycleTime(0b11_010_110));
  it('SUB (HL)', () => expectMatchingCycleTime(0b10_010_110));

  // SBC
  it.each(cpu.registers.baseRegisters)('SBC $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_011_000 + register.code);
  });
  it('SBC 0xnn', () => expectMatchingCycleTime(0b11_011_110));
  it('SBC (HL)', () => expectMatchingCycleTime(0b10_011_110));

  // CALL
  it('CALL nn', () => expectMatchingCycleTime(0b11_001_101));

  it('CALL NZ, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime((0b11 << 6) + (0 << 3) + 0b100);
  });

  it('CALL NZ, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime((0b11 << 6) + (0 << 3) + 0b100);
  });

  it('CALL Z, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime((0b11 << 6) + (1 << 3) + 0b100);
  });

  it('CALL Z, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime((0b11 << 6) + (1 << 3) + 0b100);
  });

  // NC
  it('CALL NC, nn - When Non-Carry', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime((0b11 << 6) + (2 << 3) + 0b100);
  });

  it('CALL NC, nn - When Cary', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime((0b11 << 6) + (2 << 3) + 0b100);
  });

  // C
  it('CALL C, nn - When Carry', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime((0b11 << 6) + (3 << 3) + 0b100);
  });

  it('CALL C, nn - When NonCary', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime((0b11 << 6) + (3 << 3) + 0b100);
  });

  // RET
  it('RET', () => expectMatchingCycleTime(0b11_001_001));
  it('RETI', () => expectMatchingCycleTime(0b11_011_001));
  it('RET NZ - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime((0b11 << 6) + (0 << 3));
  });

  it('RET NZ - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime((0b11 << 6) + (0 << 3));
  });

  it('RET Z - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime((0b11 << 6) + (1 << 3));
  });

  it('RET Z - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime((0b11 << 6) + (1 << 3));
  });

  it('RET NC - When Non-Cary', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime((0b11 << 6) + (2 << 3));
  });

  it('RET NC - When Carry', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime((0b11 << 6) + (2 << 3));
  });

  it('RET C - When Cary', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime((0b11 << 6) + (3 << 3));
  });

  it('RET C - When Non-Carry', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime((0b11 << 6) + (3 << 3));
  });


  // RST
  it.each([0, 1, 2, 3, 4, 5, 6, 7,])('RST $', (operand: number) => {
    expectMatchingCycleTime((0b11 << 6) + (operand << 3) + 0b111);
  });

  // General Purpose
  it('DAA', () => expectMatchingCycleTime(0x27));
  it('CPL', () => expectMatchingCycleTime(0b00_101_111));
  it('NOP', () => expectMatchingCycleTime(0));
  it('SCF', () => expectMatchingCycleTime(0x37));
  it('HALT', () => expectMatchingCycleTime(0x76));
  it('STOP', () => expectMatchingCycleTime(0x10));


  // IO Ops
  it.each(cpu.registers.baseRegisters)('LD $name, (HL)', (register: CpuRegister) => {
    expectMatchingCycleTime((1 << 6) + (register.code << 3) + 0b110);
  });
  it('LD A, (BC)', () => {
    cpu.registers.BC.value = 0x8000;
    expectMatchingCycleTime(0b1010);
  });
  it('LD A, (DE)', () => {
    cpu.registers.DE.value = 0x8000;
    expectMatchingCycleTime(0b11010);
  });
  it('LD A, (C)', () => {
    cpu.registers.C.value = 0x00;
    expectMatchingCycleTime(0b11110010);
  });
  it('LD A, n', () => expectMatchingCycleTime(0b11_110_000));
  it('LD A, nn', () => {
    cpu.memory.writeWord(0x8001, 0x8000);
    expectMatchingCycleTime(0b11111010)
  });
  it('LD A, (HLI)', () => {
    cpu.registers.HL.value = 0x8000;
    expectMatchingCycleTime(0b101010);
  });
  it('LD A, (HLD)', () => {
    cpu.registers.HL.value = 0x8000;
    expectMatchingCycleTime(0b111010);
  });
  it.each(cpu.registers.baseRegisters)('LD (HL) $name', (register: CpuRegister) => {
    expectMatchingCycleTime((0b1110 << 3) + register.code);
  });
  it('LD (C), A', () => expectMatchingCycleTime(0b11100010));
  it('LD (n), A', () => expectMatchingCycleTime(0b11100000));
  it('LD (nn), A', () => expectMatchingCycleTime(0b11_101_010));
  it('LD (BC), A', () => expectMatchingCycleTime(0b10));
  it('LD (DE), A', () => expectMatchingCycleTime(0b10010));
  it('LD (HLI), A', () => expectMatchingCycleTime(0b100010));
  it('LD (HLD), A', () => expectMatchingCycleTime(0b110010));

  // LD R, R1
  cpu.registers.baseRegisters.forEach(firstRegister => {
    cpu.registers.baseRegisters.forEach(secondRegister => {
      it(`LD ${firstRegister.name}, ${secondRegister.name}`, () => {
        expectCycleTimeToBe((1 << 6) + (firstRegister.code << 3) + secondRegister.code, SingleCycleInstructionCount);
      })
    });
  });

  it('LD (HL), 0xnnnn', () => expectMatchingCycleTime(0b110110));

  it.each(cpu.registers.baseRegisters)('LD $name, n', (register: CpuRegister) => {
    expectCycleTimeToBe((register.code << 3) + 0b110, TwoCycleInstructionCount);
  });

  it('LD (nn), SP', () => expectMatchingCycleTime(0b00_001_000));

  // LD dd, nn
  cpu.registers.registerPairs
    .filter(registerPair => registerPair.name !== 'AF')
    .forEach(registerPair => {
      it(`LD ${registerPair.name} nn`, () => {
        expectMatchingCycleTime((registerPair.code << 4) + 1)
      })
    });
  it('LD SP, HL', () => expectMatchingCycleTime(0b11111001));

  // PUSH qq
  cpu.registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP')
    .forEach(registerPair => {
      it(`PUSH ${registerPair.name}`, () => {
        expectMatchingCycleTime((0b11 << 6) + (registerPair.code << 4) + 0b101)
      });
    });

  // POP qq
  cpu.registers.registerPairs
    .filter(registerPair => registerPair.name !== 'SP' && registerPair.name !== 'AF')
    .forEach(registerPair => {
      it(`POP ${registerPair.name}`, () => {
        expectMatchingCycleTime((0b11 << 6) + (registerPair.code << 4) + 0b001)
      });
    });

  it('POP AF', () => expectMatchingCycleTime((0b11 << 6) + (0b11 << 4) + 0b001));
  it('LDHL SP, n', () => expectMatchingCycleTime(0b11_111_000));

  // Interrupts
  it('EI', () => expectMatchingCycleTime(0b11_111_011));
  it('DI', () => expectMatchingCycleTime(0xf3));

  // Jump
  it('JP 0xnnnn', () => expectMatchingCycleTime(0b11_000_011));
  it('JP NZ, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime(0b11_000_010);
  });
  it('JP NZ, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime(0b11_000_010);
  });

  it('JP Z, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime(0b11_001_010);
  });

  it('JP Z, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime(0b11_001_010);
  });

  it('JP NC, nn - When Non-Carry', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime(0b11_010_010);
  });

  it('JP NC, nn - When Cary', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime(0b11_010_010);
  });

  // C
  it('JP C, nn - When Carry', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime(0b11_011_010);
  });

  it('JP C, nn - When NonCary', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime(0b11_011_010);
  });

  it('JR 0xnn', () => expectMatchingCycleTime(0b00_011_000));
  it('JR NZ, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime(0b00_100_000);
  });
  it('JR NZ, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime(0b00_100_000);
  });
  it('JR Z, nn - When Zero', () => {
    cpu.registers.F.isResultZero = true;
    expectMatchingCycleTime(0b00_101_000);
  });

  it('JR Z, nn - When Non-Zero', () => {
    cpu.registers.F.isResultZero = false;
    expectMatchingCycleTime(0b00_101_000);
  });

  it('JR NC, nn - When Non-Carry', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime(0b00_110_000);
  });

  it('JR NC, nn - When Cary', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime(0b00_110_000);
  });
  it('JR C, nn - When Carry', () => {
    cpu.registers.F.isCarry = true;
    expectMatchingCycleTime(0b00_111_000);
  });

  it('JR C, nn - When NonCary', () => {
    cpu.registers.F.isCarry = false;
    expectMatchingCycleTime(0b00_111_000);
  });
  it('JP (HL)', () => expectMatchingCycleTime(0b11_101_001));


  // Logical Operators
  it.each(cpu.registers.baseRegisters)('AND $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_100_000 + register.code);
  });
  it('AND 0xnn', () => expectMatchingCycleTime(0b11_100_110));
  it('AND (HL)', () => expectMatchingCycleTime(0b10_100_110));

  it.each(cpu.registers.baseRegisters)('CP $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_111_000 + register.code);
  });
  it('CP 0xnn', () => expectMatchingCycleTime(0b11_111_110));
  it('CP (HL)', () => expectMatchingCycleTime(0b10_111_110));

  it.each(cpu.registers.baseRegisters)('OR $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_110_000 + register.code);
  });
  it('OR 0xnn', () => expectMatchingCycleTime(0b11_110_110));
  it('OR (HL)', () => expectMatchingCycleTime(0b10_110_110));

  it.each(cpu.registers.baseRegisters)('XOR $name', (register: CpuRegister) => {
    expectMatchingCycleTime(0b10_101_000 + register.code);
  });
  it('XOR 0xnn', () => expectMatchingCycleTime(0b11_101_110));
  it('XOR (HL)', () => expectMatchingCycleTime(0b10_101_110));


  // Rotate Shift
  it('RCLA', () => expectMatchingCycleTime(0b00_000_111));
  it('RLA', () => expectMatchingCycleTime(0b00_010_111));
  it('RRCA', () => expectMatchingCycleTime(0b00_001_111));
  it('RRA', () => expectMatchingCycleTime(0b00_011_111));


  // CB OPS
  function expectMatchingCycleTimeCb(value: number) {
    cpu.memory.writeByte(0x8000, 0xcb);
    cpu.memory.writeByte(0x8001, value);

    const cycles = cpu.tick();
    expect(cycles).toBe(cyclesClocked);
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      it(`BIT ${bitPosition}, ${register.name}`, () => {
        expectMatchingCycleTimeCb((0b01 << 6) + (bitPosition << 3) + register.code)
      })
    }
  });

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    it(`BIT ${bitPosition}, (HL)`, () => {
      expectMatchingCycleTimeCb((0b01 << 6) + (bitPosition << 3) + 0b110);
    })
  }

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      it(`RES ${bitPosition}, ${register.name}`, () => {
        expectMatchingCycleTimeCb((0b10 << 6) + (bitPosition << 3) + register.code);
      })
    }
  });

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    it(`RES ${bitPosition}, (HL)`, () => {
      expectMatchingCycleTimeCb((0b10 << 6) + (bitPosition << 3) + 0b110);
    })
  }

  // SWAP
  it.each(cpu.registers.baseRegisters)('SWAP $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_110_000 + register.code);
  });
  it('SWAP (HL)', () => expectMatchingCycleTimeCb(0b00_110_110));
  it.each(cpu.registers.baseRegisters)('RLC $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(register.code);
  });
  it('RLC (HL)', () => expectMatchingCycleTimeCb(0b00_000_110));
  it.each(cpu.registers.baseRegisters)('RL $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_010_000 + register.code);
  });
  it('RL (HL)', () => expectMatchingCycleTimeCb(0b00_010_110));
  it.each(cpu.registers.baseRegisters)('RRC $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_001_000 + register.code);
  });
  it('RRC (HL)', () => expectMatchingCycleTimeCb(0b00_001_110));
  it.each(cpu.registers.baseRegisters)('RR $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_011_000 + register.code);
  });
  it('RR (HL)', () => expectMatchingCycleTimeCb(0b00_011_110));
  it.each(cpu.registers.baseRegisters)('SLA $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_100_000 + register.code);
  });
  it('SLA (HL)', () => expectMatchingCycleTimeCb(0b00_100_110));
  it.each(cpu.registers.baseRegisters)('SRA $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_101_000 + register.code);
  });
  it('SRA (HL)', () => expectMatchingCycleTimeCb(0b00_101_110));
  it.each(cpu.registers.baseRegisters)('SRL $name', (register: CpuRegister) => {
    expectMatchingCycleTimeCb(0b00_111_000 + register.code);
  });
  it('SRL (HL)', () => expectMatchingCycleTimeCb(0b00_111_110));

  cpu.registers.baseRegisters.forEach(register => {
    for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
      it(`SET ${bitPosition}, ${register.name}`, () => {
        expectMatchingCycleTimeCb((0b11 << 6) + (bitPosition << 3) + register.code);
      })
    }
  });

  for (let bitPosition = 0; bitPosition < 8; bitPosition++) {
    it(`SET ${bitPosition}, (HL)`, () => {
      expectMatchingCycleTimeCb((0b11 << 6) + (bitPosition << 3) + 0b110);
    })
  }

});