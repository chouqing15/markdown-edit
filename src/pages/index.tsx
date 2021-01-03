
import React, { useRef, useState } from "react";
import marked from "../marked.esm";
import Style from './index.less';

interface IIConConfig {
  iconText:string;
  type:string;
  handleFn: (e:any) => void;
}


const PandaMdEditor = () => {

  const [ markdownValue, setMarkdownValue ] = useState(`
  # 全面推进能源消费方式变革

 - 坚持节约资源和保护环境的基本国策。建立了能源消费总量和强度双控制度，把节能指标纳入生态文明、绿色发展等绩效评价体系。党的十八大以来，我国以能源消费年均低于3%的增速支撑了经济中高速增长。非化石能源消费比重在2019年超过15%，**提前一年完成了2020年达到15%左右的目标**。

 - 加大产业结构调整力度。大力发展低能耗的先进制造业、高新技术产业、现代服务业，推动传统产业智能化、清洁化改造，工业能效水平进入世界先进行列。提升新建建筑节能标准，深化既有建筑节能改造。构建节能高效的综合交通运输体系，新能源汽车保有量和年新增量均占全球一半以上。推动全民节能，引导树立勤俭节约的消费观。
 `
 );

  const textRef = useRef<any>();

  const handleChange = (e:any) => {
    setMarkdownValue(e.target.value);
  }

  const getSelectionOptions = () => {
    const { selectionStart, selectionEnd } = (textRef.current as any);
    const selecter = markdownValue.substring(selectionStart, selectionEnd)

    return {
      selecter: selecter,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd
    }
  }

  const getButtonHandleValue = (type:string, value:string) => {
    switch(type){
      case 'blod':
        return `**${value}**`;
      default:
        return value;
    }
  }

  const selectText = (type:string = "bold") => {
    const { selecter, selectionStart, selectionEnd } = getSelectionOptions();
    const handleValue = getButtonHandleValue(type, selecter);

    if(selecter!=null&&selecter.trim()!=""){
      const replaceValue = `${markdownValue.slice(0,selectionStart)}${handleValue}${markdownValue.slice(selectionEnd)}`
      setMarkdownValue(replaceValue);
    }
  }

  // rendertoolbar

  const renderToolbar = () => {
    const toolbarOptions:IIConConfig[] = [
      {
        type: 'bold',
        iconText:'\ue677',
        handleFn: selectText
      },{
        iconText:'\ue6f8',
        handleFn: selectText,
        type:'italics'
      },{
        iconText:'\ue6f0',
        handleFn: selectText,
        type:'orderedList'
      },{
        iconText:'\ue62b',
        handleFn: selectText,
        type:'unorderedList'
      },{
        iconText:'\ue6e2',
        handleFn: selectText,
        type:'title'
      },{
        iconText:'\ue6f4',
        handleFn: selectText,
        type:'reference'
      },{
        iconText:'\ue6e6',
        handleFn: selectText,
        type:'link'
      }
    ]
    return (
      <div className={Style['panda-editor-toolbar']}>
        {toolbarOptions.map((toolbar:IIConConfig):JSX.Element => {
          return (
            <i 
              className={Style.iconfont} 
              key={toolbar.type}
              onClick={toolbar.handleFn.bind(this, toolbar.type)}
            >
              {toolbar.iconText}
            </i>
          )
        })}
      </div>
    )
  }

  return (
    <div className={Style['panda-markdown-editor']}>
      {renderToolbar()}
      <textarea ref={textRef} value={markdownValue} onChange={handleChange} className={Style['editor-content']} />
      <div className={Style['editor-view']} dangerouslySetInnerHTML={{__html: marked(markdownValue)}} />
    </div>
  )
}


export default PandaMdEditor;