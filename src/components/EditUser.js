//import statements
import React from "react";
import TextField from "@mui/material/TextField";
import { Button, MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik,useFormik } from "formik";
import moment from "moment";
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      color: "blue",
    },
  },
};

// courseName
const courseNames = [
  "Java",
  "Python",
  "C++",
  "C#",
  "JavaScript",
  "React",
  "Angular",
  "NodeJS",
  "Express",
];

//Edit user component
function EditUser(props) {
  const initialValues = {
    userName: "",
    dateOfBirth: "",
    gender: "",
    course: [],
  };

//defining states
  const [alert, setAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("error");
  const [formValues, setFormValues] = React.useState(initialValues);


//validation schema for form
  const validationSchema = Yup.object().shape({
    userName: Yup.string("Must be a Proper Name ").required("Required"),
    gender: Yup.string("Select Gender").required("Required"),
    course: Yup.array().required("Select atleast 1")
    .min(1),
    dateOfBirth: Yup.string().test(
      "DOB",
      "Minimum age should be 8",
      (value) => {
        return moment().diff(moment(value), "years") >= 8;
      }
    ),
  });
  //fetching user data
  async function fetchList() {
    let id = props.match.params.id;
    await axios
      .get(`http://localhost:3004/userInfo/${id}`)
      .then((response) => {
        setFormValues(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
//fetching user data
  React.useEffect(() => {
    fetchList();
  }, []);

//handling form submit
  const handleSubmit = async (e) => {
  
    await axios
      .put(`http://localhost:3004/userInfo/${props.match.params.id}`, e)
      .then((response) => {
      
        setAlert(true);
        setMessage("User Updated Successfully");
        setSeverity("success");
        setTimeout(() => {
          props.history.push("/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        setAlert(true);
        setMessage("User Update Failed");
      });
  };

  const gender = [
    {
      value: "male",
    },
    {
      value: "female",
    },
  ];

  // formik hook 
  const formik = useFormik({
    initialValues: formValues || initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize:true // to update formik values
  });
  
  return (
    <div>
      
      {//showing alert
      alert ? (
        <Alert variant="outlined" severity={severity} fontSize="large">
          {message}
        </Alert>
      ) : null}
      <Link to="/">
        <ArrowBackIcon fontSize="large" />
      </Link>
      <h2>This is Edit User Page</h2>

          <form onSubmit={formik.handleSubmit} >
            <Box
              mt={3}
              sx={{
                "& .MuiTextField-root": { m: 1, width: "35ch" },
                "& button": { m: 1 },
              }}
            >
              <Grid
                item
                lg="4"
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <TextField
                  label="Name"
                  variant="outlined"
                  name="userName"
                  onChange={formik.handleChange}
                  value={formik.values.userName}
                  error={formik.errors.userName}
                  helperText={formik.errors.userName}
                />

                <TextField
                  id="outlined-select-currency"
                  name="gender"
                  select
                  label="Select"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  helperText="Please select your Gender"
                >
                  {gender.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>

                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-name-label">Courses</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={formik.values.course ? formik.values.course : []}
                    onChange={formik.handleChange}
                    input={<OutlinedInput label="Courses" />}
                    MenuProps={MenuProps}
                    name="course"
                    error={formik.errors.course}
                    
                  >
                    {courseNames.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  { formik.touched.course && Boolean(formik.errors.course)? 
                <FormHelperText error="true">{formik.errors.course}</FormHelperText>: null}

                </FormControl>
                <TextField
                  type="date"
                  name="dateOfBirth"
                  onChange={formik.handleChange}
                  type="date"
                  value={formik.values.dateOfBirth}
                  error={formik.errors.dateOfBirth}
                ></TextField>

                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Box>
          </form>
    </div>
  );
}

export default EditUser;
