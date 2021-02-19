import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { FactorioService } from './factorio.service';

describe('FactorioService', () => {
  let service: FactorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactorioService);
  });

  it('should work', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      expect(actual).toEqual(expected);
    });

    scheduler.run((helpers) => {
      const { cold, expectObservable, expectSubscriptions } = helpers;
      const inputValues = { a: 2 };
      const input = cold('--a-|', inputValues);

      const output = '--b-|';

      const outputValues = {
        b: 8,
      };

      expectObservable(input.pipe(map((v) => v * 4))).toBe(
        output,
        outputValues
      );
    });
  });
});
