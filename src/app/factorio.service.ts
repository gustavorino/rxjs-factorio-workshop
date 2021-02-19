import { Injectable } from '@angular/core';
import { combineLatest, concat, interval, merge, Observable, of } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import {
  buffer,
  bufferCount,
  delay,
  filter,
  map,
  mapTo,
  scan,
  share,
  take,
  tap,
  timeInterval,
  withLatestFrom,
} from 'rxjs/operators';
import {
  Copper,
  CopperPlate,
  CopperWire,
  Ore,
  OrePlate,
  Chip,
  TYPE,
  Chest,
  Resource,
} from './factorio.types';

@Injectable({
  providedIn: 'root',
})
export class FactorioService {
  copperOreRate$: Observable<TimeInterval<Copper>>;
  chipRate$: Observable<TimeInterval<Chip>>;
  chest$: Observable<Chest>;

  constructor() {
    // Copper section
    const copperDrill$ = interval(300).pipe(
      take(50),
      mapTo({ type: TYPE.COPPER, amount: 1 } as Copper)
    );

    const copperBelt$ = copperDrill$.pipe(delay(1500));

    this.copperOreRate$ = copperBelt$.pipe(timeInterval());

    const copperFurnace$ = copperBelt$.pipe(
      mapTo({ type: TYPE.COPPER_PLATE, amount: 1 } as CopperPlate)
    );

    const copperBelt2$ = copperFurnace$.pipe(delay(200));

    const wireFactory$ = copperBelt2$.pipe(
      mapTo({ type: TYPE.COPPER_WIRE, amount: 1 } as CopperWire)
    );

    const wireBelt$ = wireFactory$.pipe(delay(300));

    // Ore section

    const oreDrill1$ = interval(300).pipe(
      take(30),
      mapTo({ type: TYPE.ORE, amount: 1, debug: 'Drill1' } as Ore)
    );

    const oreDrill2$ = interval(800).pipe(
      take(20),
      mapTo({ type: TYPE.ORE, amount: 1, debug: 'Drill2' } as Ore)
    );

    const oreBelt$ = merge(oreDrill1$, oreDrill2$);

    const oreFurnace$ = oreBelt$.pipe(
      mapTo({ type: TYPE.ORE_PLATE, amount: 1 } as OrePlate)
    );

    const oreBelt2$ = oreFurnace$.pipe(delay(200));

    const mergeBelt$ = merge(oreBelt2$, wireBelt$).pipe(share());

    const leftMergeBelt$ = mergeBelt$.pipe(
      filter((resource) => {
        return resource.type === TYPE.COPPER_WIRE;
      }),
      bufferCount(3)
    );

    const rightMergeBelt$ = mergeBelt$.pipe(
      filter((resource) => {
        return resource.type === TYPE.ORE_PLATE;
      })
    );

    const chipFactory$ = combineLatest([leftMergeBelt$, rightMergeBelt$]).pipe(
      mapTo({ amount: 1, type: TYPE.CHIP } as Chip)
    );

    this.chipRate$ = chipFactory$.pipe(timeInterval());

    const sum = (a: Resource, b: Resource) => {
      return {
        amount: a.amount + b.amount,
        type: a.type,
      } as Resource;
    };

    const otherDrill$ = interval(300).pipe(
      take(10),
      mapTo({ type: TYPE.COPPER, amount: 1 } as Copper)
    );

    this.chest$ = merge(otherDrill$, chipFactory$).pipe(
      scan((chest, resource) => {
        chest[resource.type] = chest[resource.type]
          ? sum(chest[resource.type], resource)
          : resource;
        return chest;
      }, {} as Chest)
    );
  }
}
