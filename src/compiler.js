import {Scanner}from "./scanner";
import {Parser}from "./parser";

const ElementStyle=(element,stylecontent)=>{ 

  for (let style in stylecontent) {
    element.style[style] = stylecontent[style];
  }
  return element;
 }
const CreateElement=(element,elementname)=>{

  let ele = document.createElement(element);
  ele.setAttribute("id",elementname);
  return ele
}
 const ElementValue=(element,name,value)=>{ 

  if(name=="div"){

  }else if(name=="p"){
    element.appendChild(document.createTextNode(value));
  }
  else if(name=="img"){
    element.src =value;  
  }

 return element;
}
const AddElementOther=(parent,children)=>{
  parent.appendChild(children);
}
const createArrayElement=(Elements)=>{
  let ArrayEle=[]
  Elements.array.forEach(element => {
    ArrayEle.push(element)
  });
  return ArrayEle;
}
const showFunction=(Ele)=>{
  document.getElementById("canva").appendChild(Ele);
}
const checkErrorS=(TableErrorSintaxis)=>{

  for (let index = 0; index < TableErrorSintaxis.length; index++) {  
        if(!TableErrorSintaxis[index][2]){
          return false
      }
    }

 
  return true
}
export const runCompiler=(sourceCode)=>{

  const table=Scanner(sourceCode); 
  const TableErrorSintaxis=Parser(table);

  var success=false;
  if(checkErrorS(TableErrorSintaxis)){
    success=true;
    const [AFT,ST] =Transformation(table,TableErrorSintaxis)
    GenerateCode(AFT,ST)
  }
 
  return {table:TableErrorSintaxis,success:success}  

} 
const Transformation=(table,TableErrorSintaxis)=>{
  let AFT = {
    tag : 'code',   
    body:[]
  }
  let SymbolsTable=[]

  table.forEach(ele => {

    if(ele.length==2){      
      if(ele[0].category=="funct"){
        var expression = {
          type: 'FunctExpression',
          name: ele[0].name,         
        }
        var findEle=SymbolsTable.find((E)=>
          E.name===ele[1].name
        )
        expression["arguments"]={ 
          typeEle: findEle.category,
          name:findEle.name          
        }
        AFT.body.push(expression)     
      }else{
        var findEle=SymbolsTable.findIndex((E)=>
          E.name===ele[1].name
        )
        if(findEle===-1){
          SymbolsTable.push(ele[1])
        }   
      }
    }else{
      switch (ele[1].category) {
        case "=":
          var findEle=SymbolsTable.find((E)=>
            E.name===ele[0].name
          )
          findEle['value']=ele[2].name
          break;
        case "=:":
          var findEle=SymbolsTable.find((E)=>
            E.name===ele[0].name
          )
          var newelement=ele.map(E => 
            E.name
          );
          var cadString=newelement.join('')
          var index=cadString.indexOf(":")
          var elementArrays=cadString.substring(index+1).replace(/\[|\]/g,'').split(",")
          
          findEle['children']=elementArrays
          break;
        case "=::":
          var findEle=SymbolsTable.find((E)=>
            E.name===ele[0].name
          )
         
          var contentarray=ele.slice(2)
          var Parent=[]
          var styleEle
          var lastElement
          if(contentarray[contentarray.length-1].category=="style"){
            styleEle=contentarray.pop()
            contentarray.pop()
            
            lastElement=contentarray[contentarray.length-1]
            lastElement['style']=styleEle.name
           // Parent.push(lastElement)
          }
          var currentEle
          var parentEle
  
          while(contentarray.length){
            currentEle=contentarray.pop()
            if(!(contentarray.length>0)){
              if(currentEle.name!==findEle.name){
                Parent.push(currentEle)
              }              
              break
            }
            contentarray.pop()
            //parentEle=contentarray[contentarray.length-1]
            Parent.push(currentEle)
           // Parent.push(parentEle)
          }
          if(!findEle['children']){
            findEle['children']=[]            
          }
          if(Parent.length){
            findEle['children'].push(Parent)     
          }            
                    
          break;
        case "(":

          break;
        default:
          break;
      }
    }
  });
  return [AFT,SymbolsTable];
}
const EvalChildres=(SymbolsTable,ElementCurrent,category,name)=>{
  var EleHTML=getElementHTML(category)     
  let HTML=CreateElement(EleHTML,name)
  let Child
  var currentIndexELement

  if(ElementCurrent.children){
    ElementCurrent.children.forEach((Item)=>{
      Item.forEach((ele)=>{
  
        var ElementCurrentItem=SymbolsTable.find((E)=>
                    E.name==ele.name&&E.category==ele.category
                  )    
      Child=EvalChildres(SymbolsTable,ElementCurrentItem,ElementCurrentItem.category,ElementCurrentItem.name)
      
        if(currentIndexELement){
          AddElementOther(Child,currentIndexELement)
        }
        currentIndexELement=Child
      })
      AddElementOther(HTML,currentIndexELement)
      currentIndexELement=undefined
      })
  }  
  if(ElementCurrent.value){
    var valueContent=SymbolsTable.find((E)=>
        E.name==ElementCurrent.name
    )
    HTML=setElementValue(HTML,EleHTML,valueContent.value)
  }
  if(ElementCurrent.style){
    
    var styleContent=SymbolsTable.find((E)=>
    E.name==ElementCurrent.style
    )
    HTML=setElementStyle(HTML,styleContent.value)   
  }  
 /* if(currentIndexELement){
      AddElementOther(HTML,currentIndexELement)
  } */
  return HTML

}
const GenerateCode=(AFT,SymbolsTable)=>{

  console.log(AFT,SymbolsTable)
  let HTML
  AFT.body.forEach((ele)=>{

    var category =ele.arguments.typeEle
    var name =ele.arguments.name      

    var ElementCurrent=SymbolsTable.find((E)=>
      E.name==name&&E.category==category
    )

    if(ElementCurrent){
      HTML=EvalChildres(SymbolsTable,ElementCurrent,category,name)
      showFunction(HTML) 
    }else{
      console.log("ERROR")
    }
  })
}
const getElementHTML=(category)=>{
  var EleHTML
  switch (category) {
    case "box":
      EleHTML="div"
      break;
    case "text":
      EleHTML="p"
    break;  
    case "img":
      EleHTML="img"
    break;
    default:
      break;
  }
  return EleHTML
}
const setElementValue=(HTML,etiqueta,value)=>{
  HTML=ElementValue(HTML,etiqueta,value.slice(1,-1))
  return HTML
}
const setElementStyle=(HTML,style)=>{
  var objstyle={}
  style.slice(1,-1).split(",").forEach((el)=>{
    var index=el.indexOf(":")
    objstyle[el.substring(0,index)]=el.substring(index+1)
  })
 
  HTML=ElementStyle(HTML,objstyle)
  return HTML
}