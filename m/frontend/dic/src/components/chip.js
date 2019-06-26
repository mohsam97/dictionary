import React, {Component} from 'react';
//import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';

function handleClick() {
   alert('You clicked the Chip.');
 }
const Thip = (props)=>{ 
      return(<Chip label={props.labe} onClick={handleClick}/>)
}
   
   
   export default Thip;