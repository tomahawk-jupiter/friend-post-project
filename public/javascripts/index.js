/*************************************
 * 
 * FETCH AND DOM DISPLAY
 * 
 * #1. Handle friend requests
 * #2. Submit posts
 * #3. Handle likes
 * #4. Display or hide comment form
 * #5. Submit comments
 * 
**************************************/

/// Display validation errors or a generic message for fetch err ///
const failedActionMessage = (errorMessages) => {
  const errorDiv = document.querySelector('.error-container');
  if (errorMessages) {
    errorMessages.forEach((error) => {
      const errorText = document.createElement('p');
      errorText.innerText = error.msg;
      errorDiv.append(errorText);

      const closeBtn = document.createElement('button');
      closeBtn.setAttribute('class', 'close-button btn btn-danger btn-sm');
      closeBtn.innerText = 'x';
      errorDiv.append(closeBtn);
      closeBtn.addEventListener('click', (e) => {
        e.target.parentNode.replaceChildren();
      });
    });
  }
  else {
    const errorText = document.createElement('p');
    errorText.innerText = 'Action failed! Refresh page or logout then login.';
    errorDiv.append(errorText);

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('class', 'btn btn-danger btn-sm');
    closeBtn.innerText = 'x';
    errorDiv.append(closeBtn);
    closeBtn.addEventListener('click', (e) => {
      e.target.parentNode.replaceChildren();
    });
  }
}

/// #1 HANDLE FRIEND REQUESTS ///
const makeFetch = (url, text, friendId, friendStatusDiv) => {
  fetch(url, { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ friendId })
  })
    .then(response => {
        return response.json();
    })
    .then(data => {
      if (data.successful) {
        const p = document.createElement('p');
        p.innerText = text;
        friendStatusDiv.replaceChildren(p);
        const img = friendStatusDiv.parentNode.querySelector('img');
        img.classList.replace('notFriendImg', 'friendImg');
      }
    })
    .catch((err) => {
      failedActionMessage(false);
    });
}

/// Determine if the friend request is an 'Add' or 'Accept' then makeFetch ///
const handleFriendRequests = (e) => {
  const innerText = e.target.innerText;
  const friendId = e.target.id;
  const friendStatusDiv = e.target.parentNode;

  if (innerText === 'Add') {
    makeFetch('/friend/makeRequest', 'Requested', friendId, friendStatusDiv);
  }
  if (innerText === 'Accept') {
    makeFetch('/friend/accept', 'Friend', friendId, friendStatusDiv);
  }
}

document.addEventListener('click', handleFriendRequests);


/// #2. SUBMIT POSTS ///
const postForm = document.getElementById('post-form');
const postText = document.getElementById('post-text');

const submitPost = (e) => {
  e.preventDefault();
  const postMessage = postText.value;

  fetch('/post', { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ postMessage })
  })
    .then(response => {
        return response.json();
    })
    .then(savedPost => {
      if (savedPost.errors) {
        failedActionMessage(savedPost.errors);
      }
      if (!savedPost.errors && savedPost) {
        const postContainer = document.querySelector('.posts-container');
        const postCard = document.createElement('div');
        postCard.setAttribute('class', 'post-card');

        const pForAuthor = document.createElement('p');
        pForAuthor.setAttribute('class', 'post-author');
        pForAuthor.innerText = `${savedPost.authorName} says:`;

        const pForText = document.createElement('p');
        pForText.innerText = savedPost.text;

        const divForContainer = document.createElement('div');
        divForContainer.setAttribute('class', 'comments-container');
        divForContainer.setAttribute('id', `comment${savedPost._id}`);

        const divForBtnRow = document.createElement('div');
        divForBtnRow.setAttribute('class', 'card-button-row');

        const divForLikeGroup = document.createElement('div');
        divForLikeGroup.setAttribute('class', 'like-group');

        const btnForLike = document.createElement('button');
        btnForLike.setAttribute('class', 'like-button btn');

        const imgForThumbup = document.createElement('img');
        imgForThumbup.setAttribute('class', 'like-icon');
        imgForThumbup.setAttribute('src', 'images/like.svg');

        btnForLike.append(imgForThumbup);

        const pForLikeCount = document.createElement('p');
        pForLikeCount.setAttribute('class', 'like-count');
        pForLikeCount.innerText = savedPost.likedBy.length;

        divForLikeGroup.append(btnForLike, pForLikeCount);
        
        const btnForComment = document.createElement('button');
        btnForComment.setAttribute('class', 'comment-btn btn btn-primary btn-sm');
        btnForComment.setAttribute('id', `${savedPost._id}`);
        btnForComment.innerText = 'Comment';

        divForBtnRow.append(divForLikeGroup, btnForComment);
        postCard.append(pForAuthor, pForText, divForContainer, divForBtnRow);
        postContainer.prepend(postCard);
        postText.value = '';
      }
    })
    .catch((err) => {
      failedActionMessage();
    });
}

postForm.addEventListener('submit', submitPost);


/// #3. HANDLE LIKES ///
const postsContainer = document.querySelector('.posts-container');

const handleLike = (e) => {
  let postId = null;
  let likeCountTag = null;

  if (e.target.classList.contains('like-icon')) {
    postId = e.target.parentElement.parentElement.nextSibling.id;
    likeCountTag = e.target.parentElement.nextSibling;
  }
  if (e.target.classList.contains('like-button')) {
    postId = e.target.parentElement.nextSibling.id;
    likeCountTag = e.target.nextSibling;

  }
  if (postId && likeCountTag) {
    fetch('/post/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId
      })
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.errors) {
          likeCountTag.innerText = data.likeCount;
        } 
      })
      .catch((err) => {
        failedActionMessage();
      })
  }
}

postsContainer.addEventListener('click', handleLike);


/// #4. DISPLAY OR HIDE COMMENT FORM ///
const commentForm = document.getElementById('comment-form');
const postIdInput = document.getElementById('postid-input');
const postBottom = document.querySelector('.post-bottom');

const displayCommentForm = (e) => {
  
  if (e.target.innerText === 'Comment') {
    const button = e.target;
    
    // Change the look of clicked button // 
    button.setAttribute('class', 'btn-danger');
    button.innerText = 'Cancel';

    const postId = button.id;
    postIdInput.value = postId;

    // Swap forms and remove postForm //
    postBottom.insertBefore(commentForm, postForm);
    postForm.style.display = 'none';
    commentForm.style.display = 'block';


  } else if (e.target.innerText === 'Cancel') {
    const button = e.target;

    button.setAttribute('class', 'btn-primary');
    button.innerText = 'Comment';

    postIdInput.value = ''; 
    commentText.value = '';

    /// Swap forms back ///
    postBottom.insertBefore(postForm, commentForm);
    commentForm.style.display = 'none';
    postForm.style.display = 'block';
  }
}
const postArea = document.querySelector('.post-top');
postArea.addEventListener('click', displayCommentForm);


/// #5. SUBMIT COMMENTS ///
const commentText = document.getElementById('comment-text');

const submitComment = (e) => {
  e.preventDefault();
  const comment =  commentText.value;
  const postId = postIdInput.value;

  fetch('/post/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      commentText: comment,
      postId: postId
    })
  })
    .then((response) => {
      return response.json();
    })
    .then((comment) => {
      if (comment.errors) {
        failedActionMessage(comment.errors);
      }
      if (!comment.errors && comment) {
        const specificCommentContainer = document.getElementById(`comment${comment.post}`);
        const commentCard = document.createElement('div');
        commentCard.setAttribute('class', 'comment-card');

        const pForAuthor = document.createElement('p');
        pForAuthor.setAttribute('class', 'comment-author');
        pForAuthor.innerText = `${comment.author} comments:`;

        const pForText = document.createElement('p');
        pForText.setAttribute('class', 'comment-text');
        pForText.innerText = comment.text;

        commentCard.append(pForAuthor, pForText);
        specificCommentContainer.prepend(commentCard);

        const highlightedBtn = document.getElementById(comment.post);
        highlightedBtn.setAttribute('class', 'btn-primary');
        highlightedBtn.innerText = 'Comment';
        postIdInput.value = ''; 

        postBottom.insertBefore(postForm, commentForm);
        commentText.value = '';
        commentForm.style.display = 'none';
        postForm.style.display = 'block';
      }
    })
      .catch((err) => {
        failedActionMessage(false);
      })
}

commentForm.addEventListener('submit', submitComment);
