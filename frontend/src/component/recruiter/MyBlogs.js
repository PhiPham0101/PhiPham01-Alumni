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
