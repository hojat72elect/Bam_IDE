import type {ASTNode} from "./ASTNode.ts";
import type {Expression} from "./Expression.ts";

export interface ReturnStatement extends ASTNode {
    type: "ReturnStatement";
    value?: Expression;
}