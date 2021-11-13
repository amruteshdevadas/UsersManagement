//import statements

import React from "react";
import TextField from "@mui/material/TextField";
import { Button, MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { Alert } from "@mui/material";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import moment from 'moment';
import { FormHelperText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

//styled components
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// CreateUser component
function CreateUser() {
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
  const theme = useTheme();
  const history = useHistory();

  //function for handling form submission
  const handleSubmit = async (e) => {
    await axios
      .post("http://localhost:3004/userInfo", e)
      .then((response) => {
        console.log(response);
        setAlert(true);
        setMessage("User Created Successfully");
        setSeverity("success");
        setTimeout(() => {
          history.push("/");
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        setAlert(true);
        setMessage("User Creation Failed");
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
//validation on form

  const validationSchema = Yup.object().shape({
    userName: Yup.string("Must be a Proper Name ").required("Required"),
    gender: Yup.string("Select Gender").required("Required"),
    course: Yup.array()
    .required("Select atleast 1")
    .min(1),
    dateOfBirth: Yup.string().test(
      "DOB",
      "Minimum age should be 8",
      value => {
        return moment().diff(moment(value),'years') >= 8;
      }
    )
  });

  //formik hook
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });
  
  return (
    <div>
      <Link to="/">
        <ArrowBackIcon fontSize="large" />
      </Link>
      {alert ? (
        <Alert variant="outlined" severity={severity}>
          {message}
        </Alert>
      ) : null}
      <h2>This is Create User Page</h2>
      <form onSubmit={formik.handleSubmit}>
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
              helperText={formik.errors.gender && Boolean(formik.errors.gender) }
              error={formik.touched.gender && Boolean(formik.errors.gender)}
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
                value={formik.values.course}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Courses" />}
                MenuProps={MenuProps}
                error={formik.errors.course && Boolean(formik.touched.course)}
                name="course"
              >

                {courseNames.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, formik.values.course, theme)}
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
              placeholder="dd-mm-yyyy"
              type="date"
              error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
              helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
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

export default CreateUser;
