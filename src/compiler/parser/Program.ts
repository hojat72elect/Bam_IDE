import type {ASTNode} from "./ASTNode.ts";
import type {Statement} from "./Statement.ts";

interface Program extends ASTNode {
    type: "Program",
    body: Statement[];
}