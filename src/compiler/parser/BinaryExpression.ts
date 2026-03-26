import type {ASTNode} from "./ASTNode.ts";
import type {Expression} from "./Expression.ts";

export interface BinaryExpression extends ASTNode {
    type: "BinaryExpression";
    operator: string;
    left: Expression;
    right: Expression;
}