
import { BudNode } from "./BudNode";
import { Tags } from "./Tags";
import * as loadedData from "../LoadedData";


export class BudNodes {
    //  public static INSTANCE: BudNodes = new BudNodes();

    // this should be displayed if it is not
    // active node
    public budNodes: Map<string, Array<BudNode>> = new Map<string, Array<BudNode>>();

    public BudNodes() {
        // this.budNodes = new Map<string, Array<BudNode>>();
    }

    public addNode(type: string, node: BudNode, tags:Tags=new Tags()) {
        var nodes: Array<BudNode> = this.budNodes.get(type);
        if (nodes == null) {
            nodes = [];
            this.budNodes.set(type, nodes);
        }
        var result: BudNode = this.getNode(type, node.getName(),tags);
        if (result == null) {
            nodes.push(node);
        }

    }

    /**
     * Find the node which do not contain any tags; If not found find the node irrespective of tags 
     * @param type 
     * @param name 
     * @param tags 
     */
    public getNode(type: string, name: string, tags:Tags=new Tags()): BudNode {
        var list: Array<BudNode> = this.budNodes.get(type);
        if (list == null) return null;
        var result: BudNode = null;
        //Find the node without the tags first
        for (var i = 0; i < list.length; i++) {

            if (list[i].getName() == name  && !list[i].getTags().hasTags()) {
                result = list[i];
                break;
            }

        }
        //If not found, find the node irrespective of tags
        if(result==null && tags.hasTags()){
             for (var i = 0; i < list.length; i++) {

            if (list[i].getName() == name ) {
                result = list[i];
                break;
            }

        }   
        }

        return result;
    }


    public getNodeByName(strnode: string, tags:Tags=new Tags()): BudNode {

        var result: BudNode;
        var iter: IterableIterator<string> = this.budNodes.keys();

        for (var type: IteratorResult<string> = iter.next(); !type.done; type = iter.next()) {
            result = this.getNode(type.value, strnode, tags);
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

    public getOrAddNode(type: string, name: string, configData:any, tags:Tags=new Tags()): BudNode {
         var result: BudNode = this.getNode(type, name,tags);
         //if it finds the node, and tagobject.hasTags() is true & returnednode.hasTags() is also true - 
         //then call addTags() by passing param tags object

        if (result == null) {
            //TODO 
            //BudNodeTypeMetaData tmd = BudNodeTypeMetaData.INSTANCE.TYPEMETADATA.get(type);
            result = new BudNode(name, type,configData,tags);

            // copy reference to graphviz properties
            // result.setConfigProperties(tmd.getProperties());
            this.addNode(type, result,tags);

        }else{
            if(tags.hasTags() && result.getTags().hasTags()){
                result.getTags().addAllTags(tags);
            }
        }

        return result;
    }

}


