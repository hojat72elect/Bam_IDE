/**
 * A simple node that creates a tree.
 * Only use this node for trees, nothing else.
 * this class is private and only usable in this file.
 */
class _Node<T> {
    value: T;
    children: _Node<T>[];

    constructor(value: T) {
        this.value = value;
        this.children = [];
    }

    /**
     * Adds a child node to the specified parent.
     * Then returns the parent node.
     */
    static insert(parentNode: _Node<any>, newValue: any): _Node<any> {
        const newNode = new _Node(newValue);
        parentNode.children.push(newNode);
        return parentNode;
    }
}

/**
 * The basic tree which can be considered as the parent of all other kinds of trees.
 */
class GeneralTree<T> {
    public root: _Node<T> | null;

    constructor(rootValue?: T) {
        this.root = rootValue ? new _Node(rootValue) : null;
    }

    /**
     * If you give it a tree node, it will traverse through all of its children recursively.
     */
    public traverse(node: _Node<T> | null = this.root, depth: number = 0) {
        if (!node) return "";

        let resultingString = "  ".repeat(depth) + "└──" + node.value + "\n";
        for (const child of node.children) {
            resultingString += this.traverse(child, depth + 1);
        }

        return resultingString;
    }
}