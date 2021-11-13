//import statements

import * as React from "react";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import moment from "moment";
import axios from "axios";
import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {useHistory} from "react-router-dom"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// users component
export default function Users() {
  //defining states
  const [page, setPage] = React.useState(0); //current page
  //number of rows per page
  const [rowsPerPage, setRowsPerPage] = React.useState(7);  
  const [userInfo, setUserInfo] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  //state for alert message to show
  const [alert, setAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("error");
  //state for loading
  const history = useHistory();
  useEffect(() => {
    fetchColumn();
    fetchUser();
  }, []);

  //fetching columns
  async function fetchColumn() {
    axios
      .get("http://localhost:3004/columns")
      .then((response) => {
        setColumns(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
//fetching users
  async function fetchUser() {
    axios
      .get("http://localhost:3004/userInfo")
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //pagination functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //function for deleting user
  const handleDelete = async (id) => {
    //confirm delete from user
    let confirm = window.confirm("Are you sure you want to delete this user?")
    if (confirm) {
      //deleting user
      await axios
        .delete(`http://localhost:3004/userInfo/${id}`)
        .then((response) => {
          setAlert(true);
          setAlertMessage("User deleted successfully");
          setAlertType("success");
          setTimeout(()=>{
            setAlert(false);
            fetchUser();
          },1000)
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //function for calcualting age
  const calAge = (dateOfBirth) => {
    //calculate month difference from current date in time
    var dob = new Date(Date.parse(dateOfBirth));
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff);
    var year = age_dt.getUTCFullYear();
    let age = Math.abs(year - 1970);
    return age;
  };

  return (
    <>
    {//alert message
      alert && <Alert severity={alertType}>{alertMessage}</Alert>
    }
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2> Users List</h2>
      </Grid>
      <Paper sx={{ maxWidth: "90%", overflow: "hidden", mx: "auto" }}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          marginRight="2rem"
        >
          <Link to ='/create' style={{ textDecoration: 'none' }}>
          <Button  variant="contained">
          <AddCircleOutlineIcon />
            Add User
          </Button>
          </Link>

        </Grid>
        <table
          className="table table-bordered"
          id="dataTable"
          width="100%"
          cellspacing="2"
        >
          <thead>
            <tr>
              {columns &&
                columns.map((column) => {
                  return <th key={column.id}>{column.label}</th>;
                })}
            </tr>
          </thead>
          <tfoot>
            <tr>
              {columns &&
                columns.map((column) => {
                  return <th key={column.id}>{column.label}</th>;
                })}
            </tr>
          </tfoot>
          <tbody style={{ textAlign: "center" }}>
            
            {//map through users
            userInfo &&
              userInfo
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((obj, index) => {
                  return (
                    <tr key={obj.id}>
                      <td>{index + 1}</td>
                      <td>{obj.userName}</td>
                      <td>{moment(obj.dateOfBirth).format("DD-MM-YYYY")}</td>
                      <td style={ 
                        calAge(obj.dateOfBirth)<=10  ? {color:"red"} : null}>
                        {calAge(obj.dateOfBirth)}
                        </td>
                      <td>{obj.gender}</td>
                      <td>
                        <Link to ={`/edit/${obj.id}`} style={{ textDecoration: 'none', }}>
                        <ModeEditOutlineIcon
                          variant="contained"
                          style={{margin:"0 0.5rem"}} 
                        >
                          Edit
                        </ModeEditOutlineIcon>
                          </Link>
                        <DeleteForeverIcon
                          variant="contained"
                          color="error"
                          style={{margin:"0 0.5rem"}}
                          onClick={() => {
                            handleDelete(obj.id);
                          }}
                        >
                        </DeleteForeverIcon>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={userInfo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
