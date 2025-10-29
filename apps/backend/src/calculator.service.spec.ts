/**
 * TDD Example: Calculator Service
 * This demonstrates the Red-Green-Refactor workflow
 *
 * 1. RED: Write a failing test
 * 2. GREEN: Write minimal code to pass the test
 * 3. REFACTOR: Improve the code quality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService (TDD Example)', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should add two positive numbers', () => {
      // Arrange
      const a = 5;
      const b = 3;
      const expected = 8;

      // Act
      const result = service.add(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    it('should add negative numbers', () => {
      expect(service.add(-5, -3)).toBe(-8);
    });

    it('should add zero', () => {
      expect(service.add(5, 0)).toBe(5);
      expect(service.add(0, 5)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(service.subtract(10, 3)).toBe(7);
    });

    it('should handle negative results', () => {
      expect(service.subtract(3, 10)).toBe(-7);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(service.multiply(4, 3)).toBe(12);
    });

    it('should handle multiplication by zero', () => {
      expect(service.multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(service.multiply(-4, 3)).toBe(-12);
      expect(service.multiply(-4, -3)).toBe(12);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(service.divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => service.divide(10, 0)).toThrow('Cannot divide by zero');
    });

    it('should handle negative numbers', () => {
      expect(service.divide(-10, 2)).toBe(-5);
      expect(service.divide(-10, -2)).toBe(5);
    });
  });
});
