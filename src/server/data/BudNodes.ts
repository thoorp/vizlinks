
import { BudNode } from "./BudNode";
import * as loadedData from "../LoadedData";


export class BudNodes {
    //  public static INSTANCE: BudNodes = new BudNodes();

    // this should be displayed if it is not
    // active node
    public budNodes: Map<string, Array<BudNode>> = new Map<string, Array<BudNode>>();

    public BudNodes() {
        // this.budNodes = new Map<string, Array<BudNode>>();
    }

    public addNode(type: string, node: BudNode) {
        var nodes: Array<BudNode> = this.budNodes.get(type);
        if (nodes == null) {
            nodes = [];
            this.budNodes.set(type, nodes);
        }
        var result: BudNode = this.getNode(type, node.getName());
        if (result == null) {
            nodes.push(node);
        }

    }


    public getNode(type: string, name: string): BudNode {
        var list: Array<BudNode> = this.budNodes.get(type);
        if (list == null) return null;
        var result: BudNode = null;

        for (var i = 0; i < list.length; i++) {

            if (list[i].getName() == name) {
                result = list[i];
                break;
            }

        }
        return result;
    }


    public getNodeByName(strnode: string): BudNode {

        var result: BudNode;
        var iter: IterableIterator<string> = this.budNodes.keys();

        for (var type: IteratorResult<string> = iter.next(); !type.done; type = iter.next()) {
            result = this.getNode(type.value, strnode);
            if (result != null)
                break;
        }

        return result;
    }


    public getNodes(type: string): BudNode[] {
        var list: BudNode[] = this.budNodes.get(type);
        return list;
    }

    public getNodeTypes(): string[] {
        var types: string[] = [];


        var iter: IterableIterator<string> = this.budNodes.keys();

        for (var type: IteratorResult<string> = iter.next(); !type.done; type = iter.next()) {
            types.push(type.value);
        }
        return types;
    }

    public getOrAddNode(type: string, name: string, configData:any): BudNode {
        var result: BudNode = this.getNode(type, name);
        if (result == null) {
            //TODO 
            //BudNodeTypeMetaData tmd = BudNodeTypeMetaData.INSTANCE.TYPEMETADATA.get(type);
            result = new BudNode(name, type,configData);
            // copy reference to graphviz properties
            // result.setConfigProperties(tmd.getProperties());
            this.addNode(type, result);

        }
        return result;
    }

}


// let bnode: BudNode = new BudNode("CustomerApi", "app");
// let fnode: BudNode = new BudNode("getCustomerDetails1", "function");
// let fnode2: BudNode = new BudNode("getCustomerDetails2", "function");
// let fnode3: BudNode = new BudNode("getCustomerDetails3", "function");
// bnode.addChild(fnode);

// let allnodes: BudNodes = new BudNodes();
// allnodes.addNode("app", bnode);
// allnodes.addNode("function", fnode);
// allnodes.addNode("function", fnode2);
// allnodes.addNode("function", fnode3);
// allnodes.getOrAddNode("api","AccountsApi");
// console.log(allnodes.getNode("app", "CustomerApi"));
// console.log("Done step 1");
// console.log(allnodes.getNodeTypes());
// console.log(allnodes.getNodeByName("getCustomerDetails3"));
