import type {ASTNode} from "./ASTNode.ts";

export interface Identifier extends ASTNode{
    type : "Identifier";
    name : string;
}