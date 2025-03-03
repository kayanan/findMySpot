import * as React from 'react';
import Button from '@mui/joy/Button';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';

export default function ToggleGroup({value,setValue,values}) {
  //const [value, setValue] = React.useState();
  return (
    
    <ToggleButtonGroup
     
      value={value}
      onChange={(event, newValue) => {
        if(newValue){
           setValue(newValue);
        }
       
      }}
    >
       { values?.map((arrvalue,index)=>{
       return<Button value={arrvalue?.value} key={index}>{arrvalue?.label}</Button>
        
       })}
    </ToggleButtonGroup>

  );
}
