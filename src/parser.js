
 import {getTable,GetNoTerminals,EPSILON,isElement,Grammar}from "./grammar";

 export const Parser=(tokens)=>{
    Grammar();
    
    let tableSuccess = tokens.map((ele,idx)=>{
        var nonterminals = GetNoTerminals();
        var ruleTable = getTable();

        var stack = ['$', nonterminals[0]];
        var input = ele;
        var segAlgo=[];
       
        var subAlgo=[];
    
        subAlgo.push(stack.join(' '))
        subAlgo.push(input.map((item)=>item.category).join(' '))
        subAlgo.push("")
    
        segAlgo.push(subAlgo)
    
        var ok = true;
        var tree = new Object();
        tree.label = 'root';
        tree.children = [];
        var parents = [tree];
        
        for (var i = 0, index = 0;  1 < stack.length; ++i) {
            var stackTop = stack[stack.length - 1];
            var symbol = index < input.length ? input[index] : {category:'$', type:'$'};
            
            var rule = '';
            var symbolType=symbol.category
            if (stackTop == symbolType) {
                stack.pop();
                ++index;
                parents.pop().children.push(symbolType);
            } else {
                if (isElement(stackTop, nonterminals)) {
                    rule = ruleTable[stackTop][symbolType];
                    var node = new Object();
                    node.label = stackTop;
                    node.children = [];
                    parents.pop().children.push(node);
                    
                    if (rule == undefined) {/*EN CASO NO EXISTA PRODUCCION PARA LA POSICION EN LA TABLA*/
                        ok = false;
                        break;
                    }
                    
                    stack.pop();
                    
                    var reverseDevelopment = rule.split('->')[1].trim().split(' ').slice(0).reverse();
                    
                    for (var i in reverseDevelopment) {
                        parents.push(node);
                    }
                    
                    if (!isElement(EPSILON, reverseDevelopment)) {
                        stack = stack.concat(reverseDevelopment);
                    } else {
                        parents.pop().children.push(EPSILON);
                    }
                } else {                
                    ok = false;
                    break;
                }
            }
            subAlgo=[];
            subAlgo.push(stack.join(' '))
            subAlgo.push(input.slice(index).map((item)=>item.category).join(' '))
            subAlgo.push(rule)
            
            segAlgo.push(subAlgo);
        }
        
        return [idx+1,ok?segAlgo:null,ok];
    })
   
    return tableSuccess;
  } 