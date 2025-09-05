
export class List {

  public static getSortedIndex<T>(array: Array<T>, isLessThan: (current: T) => boolean): number {
    let low = 0
    let high = array.length;
  
    while (low < high) {
      const mid = low + high >>> 1;
      if (isLessThan(array[mid])) low = mid + 1;
      else high = mid;
    }
    return low;
  }

}

export default List