
import { BudNode } from "./BudNode";
import { Tags } from "./Tags";
import * as loadedData from "../LoadedData";

const R = require("ramda");

export class BudNodes {

    // this should be displayed if it is not
    // active node
    public budNodes: Map<string, Array<BudNode>> = new Map<string, Array<BudNode>>();

    public BudNodes() {
    }

    /**
     * Adds a passed node to the master map under passed type. If node passed is first one for the type,
     * then create array with this node and add it to msater map.
     * Add node only if the passed node does node does not exist
     * @param type 
     * @param node 
     * @param tags optional tags to search
     */
    public addNode(type: string, node: BudNode, tags: Tags = new Tags()) {
        var nodes: Array<BudNode> = this.budNodes.get(type);
        if (nodes == null) {
            nodes = [];
            this.budNodes.set(type, nodes);
        }
        var result: BudNode = this.getNode(type, node.getName(), tags);
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
    public getNode(type: string, name: string, tags: Tags = new Tags()): BudNode {
        var list: Array<BudNode> = this.budNodes.get(type);
        if (list == null) return null;
        var result: BudNode = null;
        //Find the node without the tags first

        result = R.find(x => x.getName() == name && !x.getTags().hasTags())(list);

        //If not found, find the node irrespective of tags
        //removed && tags.hasTags()
        if (result == null) {
            result = R.find(x => x.getName() == name)(list);

        }

        return result;
    }


    /**
     * Searches all types and finds a node with name as passed
     * @param strnode name of the node that needs to be searched
     * @param tags optional tags to filter by
     */
    public getNodeByName(strnode: string, tags: Tags = new Tags()): BudNode {

        var result: BudNode;

        //Use  reduce through each type and if found, stop
        const reducer = (acc, curr) => {
            var node = this.getNode(curr[0], strnode, tags);
            return node ? R.reduced(node) : null;
        }
        result = R.reduce(reducer, null, this.budNodes);

        return result;
    }


    /**
     * returns array of all nodes by given type
     * @param type 
     */
    public getNodes(type: string): BudNode[] {
        return this.budNodes.get(type);

    }

    /**
     * returns string array of all types
     */
    public getNodeTypes(): string[] {
        const mapper = x => x[0];
        var types: string[] = R.map(mapper, Array.from(this.budNodes));
        return types;
    }

    /**
     * checks if node exists. If not create a node and add it to master list and return
     * add tags to the node if tags is passed as param and if the node is being created new 
     * or already has existing tags
     * @param type 
     * @param name 
     * @param configData 
     * @param tags 
     */
    public getOrAddNode(type: string, name: string, configData: any, tags: Tags = new Tags()): BudNode {
        var result: BudNode = this.getNode(type, name, tags);
        //if it finds the node, and tagobject.hasTags() is true & returnednode.hasTags() is also true - 
        //then call addTags() by passing param tags object

        if (result == null) {
            result = new BudNode(name, type, configData, tags);

            this.addNode(type, result, tags);

        } 
        //If the found object has tags then if param has tags, add these tags
        //If param has no tags, then remove tags from Node because per principle of design 
        //if there is a node without tags and with tags - have Node without tags and tags are attached to Links 
        if(result.getTags().hasTags()){
            if (tags.hasTags() ) 
                result.getTags().addAllTags(tags);
           else
                result.getTags().removeAllTags(); 
            
        }

        return result;
    }

}
