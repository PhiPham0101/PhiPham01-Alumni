// import { useContext, useEffect, useState } from "react";
// import { Button, Modal, TextareaAutosize, TextField, makeStyles } from '@material-ui/core';
// import FileBase64 from 'react-file-base64';
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   title: {
//     marginBottom: '10px',
//   },
//   textarea: {
//     padding: '10px',
//     marginBottom: '10px',
//   },
//   container: {
//       backgroundColor: theme.palette.primary.main,
//       color: 'white',
//       marginBottom: 20,
//       fontWeight: 'lighter',
//       padding: '5px 0',
//   },
//   media: {
//       height: 150,
//   },
// }));

// const MyBlogs = (props) => {
//   const classes = useStyles();
//   // const setPopup = useContext(SetPopupContext);

//   // const [data, setData] = React.useState({
//   //   title: '',
//   //   content: '',
//   //   attachment: '',
//   // });
//   // const dispatch = useDispatch();
//   // const { isShow } = useSelector(modalState$);

//   // React.useEffect(() => {
//   //   dispatch(actions.getPosts.getPostsRequest());
//   // }, [dispatch]);

//   // const onLikeBtnClick = React.useCallback(() => {
//   //   dispatch(
//   //     updatePost.updatePostRequest({ ...post, likeCount: post.likeCount + 1 })
//   //   );
//   // }, [dispatch, post]);

//   // const onClose = React.useCallback(() => {
//   //   dispatch(hideModal());
//   //   setData({
//   //     title: '',
//   //     content: '',
//   //     attachment: '',
//   //   });
//   // }, [dispatch]);

//   // const onSubmit = React.useCallback(() => {
//   //   dispatch(createPost.createPostRequest(data));
//   //   onClose();
//   // }, [data, dispatch, onClose]);

//   const body = (
//     <div className={classes.paper} id='simple-modal-title'>
//       <h2>Tạo bài viết mới</h2>
//       <form noValidate autoComplete='off' className={classes.form}>
//         <TextField
//           className={classes.title}
//           required
//           label='Tiêu đề'
//           value={data.title}
//           onChange={(e) => setData({ ...data, title: e.target.value })}
//         />
//         <TextareaAutosize
//           className={classes.textarea}
//           rowsMin={10}
//           rowsMax={15}
//           placeholder='Content...'
//           value={data.content}
//           onChange={(e) => setData({ ...data, content: e.target.value })}
//         />
//         <FileBase64
//           accept='image/*'
//           multiple={false}
//           type='file'
//           value={data.attachment}
//           onDone={({ base64 }) => setData({ ...data, attachment: base64 })}
//         />
//         <div className={classes.footer}>
//           <Button
//             variant='contained'
//             color='primary'
//             component='span'
//             fullWidth
//             onClick={onSubmit}
//           >
//             Tạo bài viết
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
  

//   return (
//     <>
//         <Grid container spacing={2} alignItems='stretch'>
//             {posts.map((post) => (
//                 <Grid key={post._id} item xs={12} sm={6}>
//                 <Post post={post} />
//                 </Grid>
//             ))}
//         </Grid>
//         <Grid>
//             <div>
//                 <Modal open={isShow} onClose={onClose}>
//                     {body}
//                 </Modal>
//                 </div>
//         </Grid>
//         <Card>
//             <CardHeader
//                 avatar={<Avatar>A</Avatar>}
//                 title={post.author}
//                 subheader={moment(post.updatedAt).format('HH:MM MMM DD,YYYY')}
//                 action={
//                 <IconButton>
//                     <MoreVertIcon />
//                 </IconButton>
//                 }
//             />
//             <CardMedia
//                 image={post.attachment || ''}
//                 title='Title'
//                 className={classes.media}
//             />
//             <CardContent>
//                 <Typography variant='h5' color='textPrimary'>
//                 {post.title}
//                 </Typography>
//                 <Typography variant='body2' component='p' color='textSecondary'>
//                 {post.content}
//                 </Typography>
//             </CardContent>
//             <CardActions>
//                 <IconButton onClick={onLikeBtnClick}>
//                 <FavoriteIcon />
//                 <Typography component='span' color='textSecondary'>
//                     {`${post.likeCount} likes`}
//                 </Typography>
//                 </IconButton>
//             </CardActions>
//         </Card>
//     </>
    
//   );
// };

// export default MyBlogs;
import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

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
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const BlogTile = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const { blog, getData } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [blogDetails, setBlogDetails] = useState(blog);

  console.log(blogDetails);

  const handleInput = (key, value) => {
    setBlogDetails({
      ...blogDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    history.push(location);
  };

  const handleClose = () => {
    setOpen(false);
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
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
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
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(blog.dateOfPosting);

  return (
    <Paper className={classes.blogTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{blog.title}</Typography>
          </Grid>
          <Grid item>Nội dung: {blog.postname}</Grid>
          <Grid item>Hình ảnh: {blog.avatar}</Grid>
          <Grid item>Ngày đăng bài: {postedOn.toLocaleDateString()}</Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          <Grid item>
            <Button
              variant="contained"
              className={classes.statusBlock}
              onClick={() => {
                setOpenUpdate(true);
              }}
              style={{
                background: "#FC7A1E",
                color: "#fff",
              }}
            >
              Cập nhật bài đăng
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
            >
              Xóa bài đăng
            </Button>
          </Grid>
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
                label="Tiêu đề bài viết"
                value={blogDetails.title}
                onChange={(event) => {
                  handleInput("title", event.target.value);
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Nội dung bài biết"
                variant="outlined"
                value={blogDetails.postname}
                onChange={(event) => {
                  handleInput("postname", event.target.value);
                }}
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
                onClick={() => handleJobUpdate()}
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


const MyBlogs = (props) => {
  const [blogs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    postname: "",
    avatar: "",
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [`myblogs=1`];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.blogs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address);
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

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
            <Typography variant="h3">Bài đăng của tôi</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Tìm kiếm bài đăng"
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
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
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
              Không tìm thấy bài đăng!
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MyBlogs;
