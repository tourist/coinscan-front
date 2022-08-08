import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useState, useEffect } from 'react';

function DebouncedInput({
  debounce = 500,
  onChangeCallback,
  ...props
}: {
  debounce?: number;
  onChangeCallback?: (value: string) => void;
  value: string;
} & TextFieldProps) {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeCallback && onChangeCallback(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChangeCallback]);

  return (
    <TextField
      sx={{ minWidth: 420 }}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default DebouncedInput;
