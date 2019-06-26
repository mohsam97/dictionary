import React, { Component } from 'react';
import { gql } from "apollo-boost";
import ApolloClient from "apollo-boost";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import { array } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles, Chip, Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Thip from './components/chip'
import Search from '@material-ui/icons/Search';
import ArrowBack from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const client = new ApolloClient({
  uri: "http://127.0.0.1:8000/graphql/"
});

const GET_Terms = gql`query l ($tag: String,$term:String)
{
    Terms(tags_Name:$tag,term_Contains:$term) {
      edges {
        node {
          term
          category{
            name
          }
          tags{
            edges{
              node{
                name
              }
            }
          }
        }
      }
    }
  }
`;


var temp = [];
function createdata(data) {
  let newdata = []
  data.Terms.edges.map((n, i) => (newdata.push({ term: n.node.term, category: n.node.category.name, Tag: n.node.tags })))
  return newdata
}

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2, 3),
    margin: 10,
    borderRadius: 20,


  },
  root2: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
    height: 10,
    position: 'absolute',
    left: "80%",
    top: "15%",
    opacity: .35,
    
  
  },
  root3:{
    position: 'absolute',
    right: 20,
  }

});




class App extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleClicki = this.handleClicki.bind(this);
    this.handleClickb = this.handleClickb.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      columns: [
        { title: 'Term', field: 'term' },
        { title: 'Category', field: 'category' },
        { title: 'Tags', field: 'Tag' },
      ],
      data: [{
        term: "",
        category: "",
        Tag: "",
      }],
      theQuery: GET_Terms,

      term: "",
      category: "",
      tag: "",
      
      back:[{
        term:"",
        tag:"",
      }],

      anchorEl: undefined,

      value:""
    };
  }

  componentDidMount() {

  }



  handleClicki(event) {
    this.setState({anchorEl: event.currentTarget})
  }
  

  handleClick(t) {
    let temp=[]
    this.state.back.map(n=>{ 
      temp.push(n)
    })
    temp.push({term:this.state.term,tag:t})
    console.log(temp)
    this.setState({ tag: t ,back:temp});
  }

  handleClickb() {
    if(this.state.back.length>1){
    console.log(this.state.back.pop())
    let t=this.state.back[this.state.back.length-1]
    this.setState({ tag: t.tag,term:t.term ,value:t.term});}
  }

  handleChange(event) {
    let temp=[]
    this.state.back.map(n=>{ 
      temp.push(n)
    })
    temp.push({term:event.target.value,tag:this.state.tag})
    console.log(temp)
    this.setState({ term: event.target.value, category:event.target.value, value: event.target.value, back:temp});
   // console.log(this.state.back)

  }


  render() {

    const { classes } = this.props;
    return (
      <ApolloProvider client={client}>
        <Query query={this.state.theQuery} variables={{ tag: this.state.tag ,term:this.state.term}} onCompleted={(data) => {

          let temp = [];
          data.Terms.edges.map(n => {
            let temptags = [];
            n.node.tags.edges.map((t) => (temptags.push(t.node.name)));
            temp.push({ term: n.node.term, category: n.node.category.name, Tag: temptags })
          });
          this.setState({ data: temp });
        }} >

          {({ loading, error, data }) => {
            if (error) return <p>error :(</p>;
            // console.log(data);
            if(data.Terms === undefined){
              console.log('loading')
            }else{
              //console.log(data.Terms.edges.length);

            data.Terms.edges.map(n => {
              let temptags = [];
              n.node.tags.edges.map((t) => (temptags.push(t.node.name)));
              temp.push({ term: n.node.term, category: n.node.category.name, Tag: temptags });
            });
            //console.log(this.state.anchorEl)
          }

            return (
              <div style={{ width: "100%" }}>
                <AppBar position="static" color="default">
                
                  <Toolbar>
                  <IconButton position="left" onClick={this.handleClickb}>
                <ArrowBack/>
                </IconButton>
                    <Typography variant="h6" color="inherit">
                      Dictionary
                  </Typography>
                  </Toolbar>
                </AppBar>
                <Paper className={classes.root}>
                  <Typography variant="h5"  >
                    Terms
                  </Typography>
                  <div >
                    <TextField
                    id="standard-name"
                    variant="outlined"
                    value={this.state.value}
                    className={classes.root2}
                    onChange={this.handleChange}
                   
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search/>
                        </InputAdornment>
                      ),
                    }}
                    />
                  </div>
                  <Table >
                    
                    <TableHead>
                  {this.state.data.length == 0 ? <div><p>no results found</p></div>:

                      <TableRow>
                        <TableCell>Term</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Tags</TableCell>
                      </TableRow>
                  }
                    </TableHead>
                      {loading || data  == undefined  ? <div><h1>loading</h1></div>:
                      
                    <TableBody>
                      {this.state.data.map(d => (
                        <TableRow key={d.term}>
                          <TableCell component="th" scope="row">
                            {d.term}
                          </TableCell>
                          <TableCell >{d.category}</TableCell>
                          <TableCell>{d.Tag.map(t => <Chip label={t} onClick={this.handleClick.bind(this, t)} />)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    }
                  </Table>
                </Paper>
              </div>
            )
          }}
        </Query>

      </ApolloProvider>
    );
  }
}
export default withStyles(styles)(App);
