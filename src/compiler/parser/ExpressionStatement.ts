import type {ASTNode} from "./ASTNode.ts";
import type {Expression} from "./Expression.ts";

export interface ExpressionStatement extends ASTNode {
    type: "ExpressionStatement";
    expression: Expression;
}