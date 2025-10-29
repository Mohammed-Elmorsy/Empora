/**
 * Calculator Service - TDD Example Implementation
 * This service was created following TDD principles
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  /**
   * Add two numbers
   * @param a First number
   * @param b Second number
   * @returns Sum of a and b
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Subtract two numbers
   * @param a First number (minuend)
   * @param b Second number (subtrahend)
   * @returns Difference of a and b
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiply two numbers
   * @param a First number
   * @param b Second number
   * @returns Product of a and b
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Divide two numbers
   * @param a Numerator
   * @param b Denominator
   * @returns Quotient of a divided by b
   * @throws Error if denominator is zero
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}
