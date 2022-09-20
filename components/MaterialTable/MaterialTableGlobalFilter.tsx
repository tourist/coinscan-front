import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

type MaterialTableGlobalFilterProps = {
  globalFilter?: string;
  globalFilterSearchLabel?: string;
  onGlobalFilterChange?: (value: string) => void;
  onGlobalFilterTextFieldChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const MaterialTableGlobalFilter = ({
  globalFilter,
  globalFilterSearchLabel,
  onGlobalFilterChange,
  onGlobalFilterTextFieldChange,
}: MaterialTableGlobalFilterProps) => (
  <TextField
    sx={{ width: { xs: '100%', sm: '480px' } }}
    value={globalFilter || ''}
    label={globalFilterSearchLabel}
    onChange={onGlobalFilterTextFieldChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="clear search"
            onClick={() => onGlobalFilterChange && onGlobalFilterChange('')}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

export default MaterialTableGlobalFilter;
