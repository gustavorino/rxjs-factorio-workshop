export enum TYPE {
  COPPER = 'COPPER',
  COPPER_WIRE = 'COPPER_WIRE',
  COPPER_PLATE = 'COPPER_PLATE',
  ORE = 'ORE',
  ORE_PLATE = 'ORE_PLATE',
  CHIP = 'CHIP',
}

export type Chest = {
  [key: string]: Resource;
};

export type Resource = {
  amount: number;
  type: TYPE;
  debug?: string;
};

export type Copper = Resource & { type: TYPE.COPPER };
export type CopperWire = Resource & { type: TYPE.COPPER_WIRE };
export type CopperPlate = Resource & { type: TYPE.COPPER_PLATE };
export type Ore = Resource & { type: TYPE.ORE };
export type OrePlate = Resource & { type: TYPE.ORE_PLATE };
export type Chip = Resource & { type: TYPE.CHIP };
