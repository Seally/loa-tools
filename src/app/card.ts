export class Race {
  id: number;

  getRaceString(id?: number | string): string {
    if(id === undefined) {
      id = this.id;
    } else if(typeof id !== 'number') {
      id = parseInt(id, 10);
    }

    switch(id) {
      case 1:
        return 'Kingdom';
      case 2:
        return 'Forest';
      case 3:
        return 'Wilderness';
      case 4:
        return 'Hell';
      case 5:
        return 'undefined';
      case 98:
        return 'Universal Cards';
      case 99:
        return 'Prop';
      case 97:
        return 'Demon';
      case 100:
        return 'Demon (DI)';
      default:
        throw new RangeError('Unsupported race ID: ' + id);
    }
  }
}

export class Card {
  id: number;
  name: string;
  cost: number;
  race: Race;

}
