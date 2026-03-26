import type {ASTNode} from "./ASTNode.ts";

export interface NumberLiteral extends ASTNode {
    type: "NumberLiteral";
    value: number;
}