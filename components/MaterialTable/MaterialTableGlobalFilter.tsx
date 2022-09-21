import { useMemo, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import { debounce } from '@mui/material/utils';

type MaterialTableGlobalFilterProps = {
  globalFilter?: string;
  globalFilterSearchLabel?: string;
  loading?: boolean;
  onGlobalFilterChange?: (value: string) => void;
};

const MaterialTableGlobalFilter = ({
  globalFilter,
  globalFilterSearchLabel,
  onGlobalFilterChange,
  loading,
}: MaterialTableGlobalFilterProps) => {
  const [globalFilterInputValue, setGlobalFilterInputValue] = useState<
    string | undefined
  >(undefined);

  // set initial value when it arrives (router is ready)
  useEffect(() => {
    if (globalFilterInputValue === undefined && globalFilter) {
      setGlobalFilterInputValue(globalFilter);
    }
  }, [globalFilter, globalFilterInputValue]);

  const onGlobalFilterChangeDebounced = useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilterInputValue(event.target.value);
        onGlobalFilterChange && onGlobalFilterChange(event.target.value);
      }, 250),
    [onGlobalFilterChange]
  );

  const onGlobalFilterTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGlobalFilterInputValue(event.target.value);
    onGlobalFilterChangeDebounced(event);
  };

  return (
    <TextField
      sx={{ width: { xs: '100%', sm: '480px' }, mb: 2 }}
      value={globalFilterInputValue || ''}
      label={globalFilterSearchLabel}
      onChange={onGlobalFilterTextFieldChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            <InputAdornment position="end">
              {loading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              <IconButton
                aria-label="clear search"
                onClick={() => {
                  setGlobalFilterInputValue('');
                  onGlobalFilterChange && onGlobalFilterChange('');
                }}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          </>
        ),
      }}
    />
  );
};

export default MaterialTableGlobalFilter;
