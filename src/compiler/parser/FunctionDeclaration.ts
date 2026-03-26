import type {ASTNode} from "./ASTNode.ts";
import type {Statement} from "./Statement.ts";

export interface FunctionDeclaration extends ASTNode {
    type: "FunctionDeclaration";
    name: string;
    params: string[];
    body: Statement[];
}
