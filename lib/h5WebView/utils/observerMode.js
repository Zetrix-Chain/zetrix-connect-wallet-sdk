export class ObserverMode {
  constructor() {
    this.promisePool = {}
  }
  send (method) {
    return new Promise((resolve, reject) => {
      this.promisePool[method] = {
        resolve,
        reject
      }
    })
  }
}

export default ObserverMode