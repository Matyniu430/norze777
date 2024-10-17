import React, { useRef, forwardRef, useImperativeHandle, Ref, useState, useEffect, FormEvent, MutableRefObject } from 'react';
import TextareaFormatOption from './TextareaFormatOption';
import boldIcon from '../../assets/bold.png';
import italicIcon from '../../assets/italic.svg';
import underlineIcon from '../../assets/underline.svg';
import classNames from 'classnames';
import { replaceTextWraps } from '@/Utils/utils';

export interface TextEditorRef {
  getContent: () => string;
  clear: () => void;
}

const TextEditor = forwardRef<TextEditorRef, React.HTMLProps<HTMLDivElement>>((props, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isFocused,setIsFocused] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.innerHTML || '',
    clear: () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    },
  }));

  const formatText = (command: string) => {
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand(command, false, undefined);
        const isCommandActive = document.queryCommandState(command);
      
        switch (command) {
          case 'bold': setIsBold(isCommandActive);break;
          case 'underline':setIsUnderline(isCommandActive);break;
          case 'italic': setIsItalic(isCommandActive);break;
        }
      }
    }, 0);
  }


  return (
    <div>
      <div onClick={(e) => e.preventDefault()} className='flex gap-x-16 items-center mb-4'>
        <TextareaFormatOption isEnabled={isBold} fn={() => { formatText('bold') }} icon={boldIcon} />
        <TextareaFormatOption isEnabled={isItalic} fn={() => { formatText('italic') }} icon={italicIcon} />
        <TextareaFormatOption isEnabled={isUnderline} fn={() => { formatText('underline') }} icon={underlineIcon} />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        dangerouslySetInnerHTML={{__html:replaceTextWraps(props.value as string)}}
        className={classNames(
          `border-gray border w-full min-h-[120px] text-sm bg-white px-[12px] py-[8px] ${isFocused ? 'ring-2 ring-indigo-500' : ''} outline-0 rounded-md shadow-sm`,
          props.className,
        )}
      ></div>
    </div>
  );
});

export default TextEditor;