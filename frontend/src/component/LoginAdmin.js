// import React from "react";
// import { useContext, useState } from "react";
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   makeStyles,
//   Paper,
// } from "@material-ui/core";
// import axios from "axios";
// import { Redirect } from "react-router-dom";

// import PasswordInput from "../lib/PasswordInput";
// import EmailInput from "../lib/EmailInput";
// import { SetPopupContext } from "../App";

// import apiList from "../lib/apiList";
// import isAuth from "../lib/isAuth";
// import userIsAdmin from "../lib/isAuth";

// const useStyles = makeStyles((theme) => ({
//   body: {
//     padding: "60px 60px",
//   },
//   inputBox: {
//     width: "300px",
//   },
//   submitButton: {
//     width: "300px",
//   },
// }));

// const LoginAdmin = (props) => {
//   const classes = useStyles();
//   const setPopup = useContext(SetPopupContext);

//   const [loggedin, setLoggedin] = useState(isAuth());
//   const [admin, setAdmin] = useState(true);

//   const [loginDetails, setLoginDetails] = useState({
//     email: "",
//     password: "",
//     is_admin: true,
//   });

//   const [inputErrorHandler, setInputErrorHandler] = useState({
//     email: {
//       error: false,
//       message: "",
//     },
//     password: {
//       error: false,
//       message: "",
//     },
//     is_admin: {
//         error: true,
//         message: "",
//       },
//   });

//   const handleInput = (key, value) => {
//     setLoginDetails({
//       ...loginDetails,
//       [key]: value,
//     });
//   };

//   const handleInputError = (key, status, message) => {
//     setInputErrorHandler({
//       ...inputErrorHandler,
//       [key]: {
//         error: status,
//         message: message,
//       },
//     });
//   };

//   const handleLogin = () => {
//     const verified = !Object.keys(inputErrorHandler).some((obj) => {
//       return inputErrorHandler[obj].error;
//     });
//     if (verified) {
//       axios
//         .post(apiList.login, loginDetails)
//         .then((response) => {
//           localStorage.setItem("fff", response.data.is_admin);
//         //   setLoggedin(isAuth());
//           setAdmin(true);
//           //console.log(response.data.is_admin);
//           if (response.data.is_admin == true){
//             setAdmin(true);
//             setPopup({
//                 open: true,
//                 severity: "success",
//                 message: "Đăng nhập thành công.",
//               });
//           };
          
//         })
//         .catch((err) => {
//           setPopup({
//             open: true,
//             severity: "error",
//             message: err.response.data.message,
//           });
//           console.log(err.response);
//         });
//     } else {
//       setPopup({
//         open: true,
//         severity: "error",
//         message: "Đăng nhập không thành công!",
//       });
//     }
//   };

//   return admin ? ( 
//     <Redirect to="/admin" />
//   ) : (
//     <Paper elevation={3} className={classes.body}>
//       <Grid container direction="column" spacing={4} alignItems="center">
//         <Grid item>
//           <Typography variant="h4" component="h2">
//             Đăng nhập
//           </Typography>
//         </Grid>
//         <Grid item>
//           <EmailInput
//             label="Email"
//             value={loginDetails.email}
//             onChange={(event) => handleInput("email", event.target.value)}
//             inputErrorHandler={inputErrorHandler}
//             handleInputError={handleInputError}
//             className={classes.inputBox}
//           />
//         </Grid>
//         <Grid item>
//           <PasswordInput
//             label="Mật khẩu"
//             value={loginDetails.password}
//             onChange={(event) => handleInput("password", event.target.value)}
//             className={classes.inputBox}
//           />
//         </Grid>
//         <Grid item>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => handleLogin()}
//             className={classes.submitButton}
//           >
//             Đăng nhập
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default LoginAdmin;
