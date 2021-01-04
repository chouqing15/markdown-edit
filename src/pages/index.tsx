
import React, { useEffect, useRef, useState } from "react";
import marked from "../marked.esm";
import Style from './index.less';

interface IIConConfig {
  iconText:string;
  type:string;
  handleFn: (type:string) => void;
}

interface ISelectionOption {
  selected: string,
  selectionStart: number,
  selectionEnd: number
}

marked.setOptions({
  breaks: true,
  headerIds:false,
})

const EventPreventDefault = (e:KeyboardEvent) => {
  if (e && e.preventDefault) {
    e.preventDefault()
  } else {
    (window.event as Event).returnValue = false
  }
}

const PandaMdEditor = () => {

  const [ markdownValue, setMarkdownValue ] = useState<string>('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 处理tab 和 shift-tab
  const keydown = (e:KeyboardEvent) => {

    if(e.keyCode === 9 && e.shiftKey){
      EventPreventDefault(e);
      selectText('shift-tab')
    }else if(e.keyCode === 9){
      EventPreventDefault(e);
      selectText('tab')
    }

  };

  useEffect(() => {
    window.addEventListener('keydown', keydown )
    return () => {
      window.removeEventListener('keydown', keydown )
    }
  },[markdownValue])

  const handleChange = ({ target : { value }}:React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownValue(value);
  }

  // 选中的开始结束位置和文字
  const getSelectionOptions = ():ISelectionOption => {
    const { selectionStart, selectionEnd } = textAreaRef.current as HTMLTextAreaElement;
    const selected:string = markdownValue.substring(selectionStart, selectionEnd)
    
    return {
      selected: selected,
      selectionStart: selectionStart,
      selectionEnd: selectionEnd
    }
  }

  // 手动控制 光标位置
  const setSelectPosition = (start:number, end:number) => {
    const timer = setTimeout(() => {
      (textAreaRef.current as HTMLTextAreaElement).focus();
      (textAreaRef.current as HTMLTextAreaElement).selectionStart = start;
      (textAreaRef.current as HTMLTextAreaElement).selectionEnd = end;
      clearTimeout(timer);
    }, 0);
  }

   // 点击按钮事件
  const getButtonHandleValue = (type:string) => {
    const { selected, selectionStart, selectionEnd } = getSelectionOptions();
    const valueStart:string = markdownValue.slice(0,selectionStart);
    const valueEnd:string = markdownValue.slice(selectionEnd);
    // 百分号后面跟 ** 加粗有问题， 加一个空格
    const hasTab:string = /%/g.test(selected) ? ' ' : '';
    const listArr:string[] = selected.split('\n').filter(Boolean);

    const indent:string = '  ';

    const splitValue = (selected:string) => {
      setSelectPosition(selectionStart + 2, selectionEnd + 2);
      return `${valueStart}${selected}${valueEnd}`
    }

    // 处理字体加粗和斜体
    const handleFontValue = (type:string) => {
      const sign = type === 'bold' ? '**' : '*';
      if(listArr.length > 1){
        return listArr.map((item:string) => {
          return `${sign}${item}${sign}\n`;
        }).join('');
      }else{
        return `${sign}${selected}${sign}`;
      }
    }

    // 处理列表 有序和无序
    const handleListValue = (type:string) => {
      if(listArr.length > 1){
        return listArr.map((item:string, index: number) => {
          return `${type === 'orderedList' ? `${index + 1}. ` : '- '}${item}\n`
        }).join('');
      }
      return type === 'orderedList' ? '1. ' : '- ';
    }

    switch(type){
      case 'tab':
        return splitValue(`${indent + selected.replace(/\n/g, '\n' + indent)}`);
      case 'shift-tab':
        if(selected.indexOf(indent) === 0){
          const reg = new RegExp("\n" + indent + "","g");
          return splitValue(selected.replace(indent, '').replace(reg, '\n'));
        }
        return selected;
      case 'bold':
      case 'italics':
        return splitValue(`${handleFontValue(type)}${hasTab}`);
      case 'orderedList':
      case 'unorderedList':
        return splitValue(handleListValue(type));
      case 'title':
      case 'reference':
        return splitValue(`\n${type === 'title' ? '#' : '>'} ${selected.trim()}\n`);
      default:
        return selected;
    }
  }

  const selectText = (type:string) => {
    if(!type){ return };
    setMarkdownValue(getButtonHandleValue(type));
  }

  // render toolbar

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

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if(e.keyCode === 13){
      console.log(markdownValue.split('\n').filter(Boolean));
    }
    // if(e.keyCode === 13){
    //   const xxx = markdownValue.split('\n').filter(Boolean);
    //   const lastValue = xxx[xxx.length - 1]
    //   if(lastValue.includes('- ') && lastValue.split('- ')[1]){
    //     setMarkdownValue(`${markdownValue}- `);
    //   }
    //   console.log(xxx);
    //   if(lastValue.includes('- ') && !lastValue.split('- ')[1]){
    //     xxx.splice(-1,1, '\n');
    //     setMarkdownValue(xxx.join('\n'));
    //   }
    // }
  }

  return (
    <div className={Style['panda-markdown-editor']}>
      {renderToolbar()}
      <textarea onKeyUp={handleKeyDown} ref={textAreaRef} value={markdownValue} onChange={handleChange} className={Style['editor-content']} />
      <div className={Style['editor-view']} dangerouslySetInnerHTML={{__html: marked(markdownValue)}} />
    </div>
  )
}


export default PandaMdEditor;