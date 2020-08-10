//Get dropdown list of tags
const select = document.getElementById("select")


//Get list of comments
const commentList = document.getElementById("commentList")
//Get single comment
const comments = commentList.getElementsByTagName("li")

//Get list that will hold sorted posts
const sortedPosts = document.getElementById("sortedPosts")

function sortPosts(){
  let opt;
  

  for ( var i = 0, len = select.options.length; i < len; i++ ) {
    opt = select.options[i];
    if ( opt.selected === true ) {
        break;
    }
  }

  for(let j = 0; j < comments.length; j++){
    let commentClass = comments[j].getAttribute("class")
    if(commentClass == opt.value){
      let li = document.createElement("li")
      // let newLi = document.createTextNode(comments[j])
      li.appendChild(comments[j])
      sortedPosts.appendChild(li)
      
    }
  }
}