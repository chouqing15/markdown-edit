
import React, { useRef, useState } from "react";
import marked from "../marked.esm";
import Style from './index.less';


interface IToolbarLabelInValue {
  bold:{
    iconText:string;
    handleFn: (e:any) => void;
  },
  // italics:string,
  // orderedList:string,
  // unorderedList:string,
  // title:string,
  // reference:string,
  // link:string
}

const PandaMdEditor = () => {

  const [ markdownValue, setMarkdownValue ] = useState(`
  # 全面推进能源消费方式变革

 - 坚持节约资源和保护环境的基本国策。建立了能源消费总量和强度双控制度，把节能指标纳入生态文明、绿色发展等绩效评价体系。党的十八大以来，我国以能源消费年均低于3%的增速支撑了经济中高速增长。非化石能源消费比重在2019年超过15%，**提前一年完成了2020年达到15%左右的目标**。

 - 加大产业结构调整力度。大力发展低能耗的先进制造业、高新技术产业、现代服务业，推动传统产业智能化、清洁化改造，工业能效水平进入世界先进行列。提升新建建筑节能标准，深化既有建筑节能改造。构建节能高效的综合交通运输体系，新能源汽车保有量和年新增量均占全球一半以上。推动全民节能，引导树立勤俭节约的消费观。
 `
 );

  const textRef = useRef();

  const handleChange = (e:any) => {
    setMarkdownValue(e.target.value);
  }

  const getSelectionOptions = () => {
    const selecter = window.getSelection()?.toString();
    const textareaContext = (textRef.current as any);

    return {
      selecter: selecter,
      selectionStart: textareaContext.selectionStart,
      selectionEnd: textareaContext.selectionEnd
    }
  }

  const selectText = () => {
    const obj = getSelectionOptions();
    
    console.log(obj, window.getSelection()?.toString());return false;
    // console.log(selecter, selectionStart, selectionEnd);

    // if(selecter!=null&&selecter.trim()!=""){
    //   const v = `**${selecter}**`;
    //   const vv = `${markdownValue.slice(0,selectionStart)}${v}${markdownValue.slice(selectionEnd)}`
    //   setMarkdownValue(vv);
    // }
  }

  // rendertoolbar

  const renderToolbar = () => {
    const toolbarLabelInValue:IToolbarLabelInValue = {
      bold:{
        iconText:'\ue677',
        handleFn: selectText
      },
      // italics:'\ue6f8',
      // orderedList:'\ue6f0',
      // unorderedList:'\ue62b',
      // title:'\ue6e2',
      // reference:'\ue6f4',
      // link:'\ue6e6'
    }
    return (
      <div className={Style['panda-editor-toolbar']}>
        {Object.keys(toolbarLabelInValue).map((toolbarKey:string):JSX.Element => {
          const item = (toolbarLabelInValue[toolbarKey as keyof IToolbarLabelInValue]);
          return (
            <i 
              className={Style.iconfont} 
              key={toolbarKey}
              onClick={item.handleFn}
            >
              {item.iconText}
            </i>
          )
        })}
      </div>
    )
  }

  return (
    <div className={Style['panda-markdown-editor']}>
      {renderToolbar()}
      <textarea ref={textRef} value={markdownValue} onChange={handleChange} className={Style['editor-content']}>

      </textarea>
      <div className={Style['editor-view']} dangerouslySetInnerHTML={{__html: marked(markdownValue)}} />
    </div>
  )
}


export default PandaMdEditor;