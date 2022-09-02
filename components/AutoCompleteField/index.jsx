import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function AutocompleteField({
  label,
  sx,
  options,
  onChange,
  ...props
}) {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange({ ...event, target: { ...event.target, value: newValue } });
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          {...props}
          size="small"
          fullWidth
          label={label}
        />
      )}
    />
  );
}
