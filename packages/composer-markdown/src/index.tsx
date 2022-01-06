import React, { useEffect, useState } from 'react'
import Editor from 'rich-markdown-editor'
import { ComposerProps } from '@discuzz/core'

const Composer = ({ onChange, value, placeholder, theme }: ComposerProps) => {
  const [editorKey, setEditorKey] = useState<string>(String(Math.random()))
  const [currentValue, setCurrentValue] = useState('')

  useEffect(() => {
    if (value === '' && currentValue !== '') {
      setEditorKey(String(Math.random()))
    }
  }, [value, currentValue])

  return (
    <Editor
      key={editorKey}
      placeholder={placeholder}
      defaultValue={value}
      dark={theme === 'dark'}
      onChange={(content) => {
        const newValue = content()

        onChange(newValue)
        setCurrentValue(newValue)
      }}
    />
  )
}

export default Composer
