import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Button,
  Modal,
  Box,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,

} from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";

import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

import { userType } from "../lib/isAuth";
import { useParams, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  blogTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const BlogTile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const { blog, getData } = props;
  const [blogDetails, setBlogDetails] = useState(blog);

  const handleClose = () => {
    setOpen(false);
  };

  const handleInput = (key, value) => {
    setBlogDetails({
      ...blogDetails,
      [key]: value,
    });
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(blog._id);
    axios
      .delete(`${apiList.blogs}/${blog._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleClose();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Bạn không có quyền xóa bài viết",
        });
        handleClose();
        // window.location.reload();
      });
  };

  console.log(blogDetails)
  const handleBlogUpdate = () => {
    axios
      .put(`${apiList.blogs}/${blog._id}`, blogDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Bạn không có quyền cập nhật bài viết",
        });
        handleCloseUpdate();
        console.log(err)
      });
  };

  const postedOn = new Date(blog.dateOfPosting);

  return (
    <Paper className={classes.blogTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={12} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" style={{ color: "blue" }}>{blog.title}</Typography>
          </Grid>
          <Grid item>
            <Box display={'flex'} justifyContent={'center'} width={'100%'} height={'100%'} alignItems={'center'}>
              {blog.avatar && <img src={'http://localhost:4444/image/' + blog.avatar} alt='anh' width={'60%'} style={{ minWidth: 300, maxHeight: '100%' }} />}
            </Box>
          </Grid>

          <Box width={'100%'} display={'flex'} paddingLeft={1} >
            <Grid item xs={2}>Nội dung: </Grid>
            <Grid item>{blog.postname} </Grid>
          </Box>
          <Grid item>Người đăng: {blog.recruiter.name}</Grid>
          <Grid item>Ngày đăng bài: {postedOn.toLocaleDateString()}</Grid>
        </Grid>
        <Grid item>
          <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{ color: "#00FF00", objectFit: 'contain', marginTop: 10 }}>
            <Link to={`/privateblog/${blog._id}`}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#00FF99" }}
                className={classes.statusBlock}
                // onClick={() => {
                //   setIdBlog(blog._id);
                // }}
                disabled={userType() === "applicant"}
              >
                Xem bài đăng
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{ objectFit: 'contain', marginTop: 10, marginLeft: 5 }}>
            <Button
              variant="contained"
              className={classes.statusBlock}
              onClick={() => {
                setOpenUpdate(true);
              }}
              disabled={userType() === "applicant"}
            >
              Cập nhật bài đăng
            </Button>
          </Box>
        </Grid>
        <Grid item>
          <Box width={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} style={{ objectFit: 'contain', marginTop: 10, marginLeft: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
              disabled={userType() === "applicant"}
            >
              Xóa bài đăng
            </Button>
          </Box>

        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Bạn có chắc chắn xóa?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Xóa
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Hủy
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
        reloadApi={getData}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Cập nhật bài đăng
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
            style={{ margin: "10px" }}
          >
            <Grid item>
              <TextField
                label="Tiêu đề"
                type="title-local"
                value={blogDetails.title}
                onChange={(event) => {
                  handleInput("title", event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Nội dung"
                type="postname-local"
                multiline
                rows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={blogDetails.postname}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 1000
                  ) {
                    handleInput("postname", event.target.value);
                  }
                }}
                InputProps={{ inputProps: { min: 3 } }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleBlogUpdate()}
              >
                Cập nhật
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
              >
                Hủy
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Blogs = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    searchParams = [...searchParams];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.blogs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }
    console.log(address)
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBlogs(
          response.data
        );
      })
      .catch((err) => {
        //console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };


  const params = useParams();
  console.log(params.privateblog);

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <TextField
              label="Tìm kiếm bài viết chia sẻ kinh nghiệm"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >

          {blogs.length > 0 ? (
            blogs.map((blog) => {
              return <BlogTile blog={blog} getData={getData} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Không tìm thấy bài đăng nào!
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Blogs;
