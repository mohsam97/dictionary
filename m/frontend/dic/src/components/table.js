import React, {Component} from 'react';
import MaterialTable from 'material-table';
class Table extends Component {
    constructor() {
      super();
      this.state={
          title:'123456',
          columns:[],
          data:[]
        
      };
      this._onTableChange = this._onTableChange.bind(this);
      
    }
    _onTableChange(event) {
        this.setState({title: event.target.value});
      };
    render() {
        
      return(<div><input type="text" value={this.state.title}onChange={this._onTableChange}/>
      <MaterialTable
        title="Dictionary"
        columns= {this.state.columns}
        data={this.state.data}
        
      /></div>)
    }
   }
   
   export default Table;