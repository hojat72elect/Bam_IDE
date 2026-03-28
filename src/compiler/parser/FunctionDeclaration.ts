import type {ASTNode} from "./ASTNode.ts";
import type {Statement} from "./Statement.ts";

export interface FunctionDeclaration extends ASTNode {
    type: "FunctionDeclaration";
    name: string;
    params: string[]; // input parameters that are defined in the signature of that function.
    body: Statement[]; // All the statements that go inside that function's body.
}
