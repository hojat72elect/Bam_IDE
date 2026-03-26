import type {ASTNode} from "./ASTNode.ts";

export interface StringLiteral extends ASTNode {
    type: "StringLiteral";
    value: string;
}