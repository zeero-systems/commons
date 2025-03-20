


class Abc {
  constructor(public name: string) { }

  getName() {
    return this.name
  }
}

const graph = Abc

const graphProxy = new Proxy(graph, {
  construct(currentTarget, currentArgs, newTarget) {
    if (currentTarget.prototype !== newTarget.prototype) {
      return Reflect.construct(currentTarget, currentArgs, newTarget);
    }

    return Reflect.construct(currentTarget, ['Jorginho'], newTarget);
  },
})

const inst1 = new Abc('Pedrinho')
const inst2 = new graphProxy('Paulo')

console.log(inst1, inst2)