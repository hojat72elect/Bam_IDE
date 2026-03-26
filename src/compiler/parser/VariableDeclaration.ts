import type {ASTNode} from "./ASTNode.ts";
import type {Expression} from "./Expression.ts";

export interface VariableDeclaration extends ASTNode {
    type: "VariableDeclaration";
    kind: "let" | "const"; // Shouldn't I have "var" in here as well ? (or maybe we could force our users not to use that)
    name: string;
    value?: Expression;
}
