class Node {
  constructor (value) {
    this.value = value
    this.right = null
  }

  compareTo (node) {
    return this.value - node.value
  }
}

export default class MinChain {
  constructor (node = null, compMethod) {
    this.node = node
    this.size = node === null ? 0 : 1
    this.compare = compMethod
  }

  mink (k = this.size) {
    if (k > this.size) throw Error('cannot get more then there is')
    let result = []
    let current = this.node
    for (let i = 0; i < k; i++) {
      result.push(current.value)
      current = current.right
    }

    return result
  }

  compare (n1, n2) {
    return n1.compareTo(n2)
  }
  
  insert (value) {
    let node = new Node(value)
    this.size ++
    
    if (this.node === null) this.node = node 
    else {
      
      let current = this.node 
      while (current != null) { // then check the rest
        if (this.compare(node, current) < 1) {
          node.right = current

          if (current === this.node) { // if it is the first
            this.node = node
          }
          return
        }
        if (current.right === null) {
          current.right = node
          return
        } 
        if (this.compare(node, current.right) < 1) {
          node.right = current.right
          current.right = node
          return
        }
        current = current.right
      }
    }
  }
}