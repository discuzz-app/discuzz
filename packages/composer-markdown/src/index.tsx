import React, { useEffect, useState } from 'react'
import useTheme from '@mui/material/styles/useTheme'
import Editor from 'rich-markdown-editor'
import { ComposerProps } from '@discuzz/discuzz'

const Composer = ({ onChange, value, placeholder }: ComposerProps) => {
  const theme = useTheme()

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
      dark={theme.palette.mode === 'dark'}
      onChange={(content) => {
        const newValue = content()

        onChange(newValue)
        setCurrentValue(newValue)
      }}
    />
  )
}

export default Composer
