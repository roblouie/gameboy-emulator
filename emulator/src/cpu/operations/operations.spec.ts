import {assert, beforeEach, describe, expect, it} from "vitest";
import {CpuRegister, DoubleCpuRegister} from "@/cpu/internal-registers/cpu-register";
import {CPU} from "@/cpu/cpu";
import {Memory} from "@/memory/memory";
import {InterruptController} from "@/cpu/interrupt-request-register";
import {TimerController} from "@/cpu/timer-controller";
import {GPU} from "@/gpu/gpu";
import {APU} from "@/apu/apu";


describe("Operations clock cycles matching their cycle time", () => {
  let cyclesClocked = 0;
  let cpu = new CPU(new Memory(new GPU(new InterruptController()), new APU(), new InterruptController(), new TimerController(new InterruptController())), new InterruptController(), new TimerController(new InterruptController()), (tCycles) => {
    cyclesClocked += tCycles;
  });

  function expectMatchingCycleTime(value: number) {
    cpu.memory.writeByte(0x8000, value);
    const operation = cpu.operations[value];

    cpu.tick();
    expect(cyclesClocked).toBe(operation.cycleTime);
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


});