const keywords=["box","img","text","style","for","do"];
const Puntuation=["[","]",",","{","}","(",")"];
const Operators=["+",">","=::","=:","=",":"];
const functionS=["show"];

const Letters=/^[A-Za-z]+[0-9]*$/;
const Numbers=/^[0-9]+$/;

const isKeyword=value=>keywords.includes(value);
const isOperators=value=>Operators.includes(value);
const isPuntuation=value=>Puntuation.includes(value);
const isFunction=value=>functionS.includes(value);

const isSTR=value=>value.charAt(0)=='"'  && value.charAt(value.length - 1)=='"'?true:false;


const isLetter=value=>Letters.test(value);
const isNumber=value=>Numbers.test(value);


const SplitCode = (str,dele) => str.split(dele).map(s => s.trim()).filter(s => s.length);
  

export const Scanner=(sourceCode)=>{
  let TbLex=[];
  let TbCode=[];
  const Lines=SplitCode(sourceCode,";");  
  let blanklines=sourceCode.split("\n").map(s => s.trim()).length; 

  let rowCode= [];
  let newd
  let typeData=""
  let linescomments=0
  Lines.map((line)=>{
    if(line.slice(0,2)!=="//".trim()){
      rowCode= [];
      SplitCode(line,/\s+/)
     .filter( (t)=> { return t.length > 0 })
     .map((t) =>{    
       let data
       newd=false
       if(isKeyword(t)){
         data={type: "Reserved",category: t,name: t}      
         typeData=t!=="for" && t!=="do"?t:""
       }else if(isFunction(t)){
         data={type: "Reserved",category: "funct",name: t}      
       }else if (isLetter(t)){
         const valT=TbLex.find(el=>el.name==t)
         if(valT){
           data=valT         
         }else{         
           newd=true
           if(!typeData){
            if(isLetter(t)){
              data={type:'ERROR',category:'ID',name: t}
            }else if(isNumber(t)){
              data={type:'ERROR',category:'ID',name: t}
            }else{
              data={type:'ERROR',category:'ID',name: t}
            }
           }else{
            data={type:'ID',category:typeData,name: t}
           }         
         }
       }else if (isNumber(t)) {  
        data={type: 'ERROR', category: 'NUM',name: t}
        newd=true
      } else if (isSTR(t)) {  
         data={type: 'STR', category: 'STR',name: t}
         newd=true
       } else if (isPuntuation(t)) {
         data={type: "PTN", category: t,name: t}
       }else if (isOperators(t)) {    
         data={type: "OPT",category: t, name: t}
       }     
 
       rowCode.push(data)           
       if(newd)TbLex.push(data)
     //  return data             
     })
     typeData=""
     TbCode.push(rowCode) 
    }else{
      linescomments=linescomments+1
    }    
  })
  return [TbCode,linescomments,blanklines=blanklines-Lines.length]
  
}
