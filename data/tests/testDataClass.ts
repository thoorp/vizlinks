import { should } from 'chai';
import { expect } from 'chai';

//import 'mocha';
import { BudNode } from "../BudNode";
import { Link } from "../Link";
import { BudNodes } from "../BudNodes";
import { Links } from "../Links";



 let bnode:BudNode = new BudNode("CustomerApi", "app");
 let fnode:BudNode = new BudNode("getCustomerDetails1", "function");
 let fnode2:BudNode = new BudNode("getCustomerDetails2", "function");
 let fnode3:BudNode = new BudNode("getCustomerDetails3", "function");
bnode.addChild(fnode);

let allnodes = new BudNodes();
allnodes.addNode("app", bnode);
allnodes.addNode("function", fnode);
allnodes.addNode("function", fnode2);
allnodes.addNode("function", fnode3);
let apinode:BudNode = allnodes.getOrAddNode("api","AccountsApi");


function BudNodeTest(){
    it('BudNode test pass',function() {
        expect(fnode.getParent().getName()).equals('CustomerApi');
    });
}

function BudNodesTest(){
    


    it('BudNodes test pass', function(){
        expect(allnodes.getNode("app","CustomerApi").getName()).to.equal("CustomerApi");
        expect(allnodes.getNodeByName("getCustomerDetails3").getName()).to.equal("getCustomerDetails3");
       expect( allnodes.getNodeTypes().length).to.equal(3);

        let fnode4 = new BudNode("getCustomerDetails2", "function");
        allnodes.getOrAddNode("function", "getCustomerDetails2");

        expect(allnodes.getNodes("function").length).to.equal(3);
    });
}

function LinkTest(){
    let l:Link=new Link(fnode2,apinode);
    
    it('Link test pass',function(){
        //console.log(l.toString());
        expect(l.getDestNode().getName()).to.equal("AccountsApi");
        expect(l.getSrcNode().getName()).to.equal("getCustomerDetails2");
        expect(l.isDestLateral()).to.equal(false);
    });
}

function LinksTest(){
    it('Links test pass');
}


describe('Dataclasses', function() {
    describe('BudNode', BudNodeTest);
    describe('BudNodes',BudNodesTest);
    describe('Link',LinkTest);
    describe('Links',LinksTest);

    
});
