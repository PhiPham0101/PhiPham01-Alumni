import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography className={classes.title}>
          <Button onClick={() => handleClick("/")}>
          <Typography variant="h4" style={{ color: "orange" }}>
            AlumniIT    
          </Typography>
          </Button>
        </Typography>
        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                Trang chủ
              </Button>
              <Button color="inherit" onClick={() => handleClick("/addjob")}>
                Đăng tuyển dụng
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myjobs")}>
                Bài đăng
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
                Ứng viên
              </Button>
              <Button color="inherit" onClick={() => handleClick("/addblog")}>
                Viết bài
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myblogs")}>
                Diễn đàn
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Thông tin cá nhân
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => handleClick("/home")}>
                Trang chủ
              </Button>
              <Button
                color="inherit"
                onClick={() => handleClick("/applications")}
              >
                Ứng tuyển
              </Button>
              <Button color="inherit" onClick={() => handleClick("/myblogs")}>
                Diễn đàn
              </Button>
              <Button color="inherit" onClick={() => handleClick("/profile")}>
                Thông tin cá nhân
              </Button>
              <Button color="inherit" onClick={() => handleClick("/logout")}>
                Đăng xuất
              </Button>
            </>
          )
        ) : (
          <>
            <Button color="inherit" onClick={() => handleClick("/login")}>
              Đăng nhập
            </Button>
            <Button color="inherit" onClick={() => handleClick("/signup")}>
              Đăng ký
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
