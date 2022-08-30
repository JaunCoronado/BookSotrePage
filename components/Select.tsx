import React from 'react'
import { Category } from '../typings'
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/system';

const CssTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiInputLabel-root:focused': {
    color: 'white',
  },
  '& .MuiFormHelperText-root':{
    color: 'white',
  },
  '& .MuiSelect-select':{
    color: 'white',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-root:hover::before': {
    borderBottomColor: 'white',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'white',
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },

});

interface Props {
  data: Category[],
  value: string | null,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}
const Select = ({ data, value, onChange }: Props) => {

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <CssTextField
          id="standard-select-category"
          select
          value={value}
          onChange={onChange}
          variant="standard"
          color="error"
        >
          <MenuItem key={'None'} value={'None'}>
            None
          </MenuItem>
          {data.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </CssTextField>
      </div>
    </Box>
  )
}

export default Select