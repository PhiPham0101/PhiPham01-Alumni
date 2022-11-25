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
        <Typography variant="h3" className={classes.title} style={{ color: "orange" }}>
        AlumniIT
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
                Quản lý bài đăng
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
                Nhân Viên
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
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
                Đăng ký ứng tuyển
              </Button>
              <Button color="inherit" onClick={() => handleClick("/employees")}>
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
