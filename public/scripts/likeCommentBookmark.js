window.onload = function(){
    //bookmark start
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark =>{
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click',function(e){
            let target = e.target.parentElement

            let headers = new Headers()
            headers.append('Accept','Application/JSON')

            let req = new Request(`/api/bookmarks/${target.dataset.post}`,{
                method:'GET',
                headers,
                mode:'cors'
            })

            fetch(req)
                .then(res =>res.json())
                .then(data =>{
                    if(data.bookmark){
                      
                        target.innerHTML = ' <i class="fas fa-bookmark"></i>'
                    }else{
                      
                        target.innerHTML = ' <i class="far fa-bookmark"></i>'
                    }
                })
                .catch(e=>{
                    console.error(e.response.data)
                    alert(e.response.data.error)
                })

        })
    })
    //bookmark end

    //likeDislike start

    const likeBtn = document.getElementById('likeBtn')
    const dislikeBtn = document.getElementById('disLikeBtn')

    const likeCount = document.getElementById('likeCount')
    const dislikeCount = document.getElementById('dislikeCount')


    likeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post

        reqLikeDislike('likes',postId)
            .then(res => res.json())
            .then(data =>{
                let likeText =`${data.totalLikes}`
                let dislikeText = `${data.totaldisLikes}`

                likeCount.innerHTML = likeText
                dislikeCount.innerHTML = dislikeText
            })
            .catch(e=>{
                console.log(e)
                alert(e.response.data.error)
            })
    })


    dislikeBtn.addEventListener('click',function(e){
        let postId = likeBtn.dataset.post

        reqLikeDislike('dislikes',postId)
            .then(res => res.json())
            .then(data =>{
                let dislikeText =`${data.totaldisLikes}`
                let likeText = `${data.totalLikes}`

                likeCount.innerHTML = likeText
                dislikeCount.innerHTML = dislikeText
            })
            .catch(e=>{
                console.log(e)
                
            })
    })

    function reqLikeDislike(type,postId){
        let headers = new Headers()
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type','Application/JSON')

        let req = new Request(`/api/${type}/${postId}`,{
            method: "GET",
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }

    //likeDislike end


    //follow unfollow start
    const followBtn = document.getElementById('followBtn')
    //const dislikeBtn = document.getElementById('disLikeBtn')

    const followerCount = document.getElementById('followerCount')
    const followingCount = document.getElementById('followingCount')


    followBtn.addEventListener('click',function(e){
        
        let authorId = followBtn.dataset.author
        //console.log(authorId)
        reqFollowUnfollow('follow',authorId)
            .then(res => res.json())
            .then(data =>{
                let followerText =`${data.totalFollwer}`
                //let followingText = `${data.totalfollowing}`
                let followText = data.followed ? 'Followed' : 'Follow'

                console.log(data.followed)

                followerCount.innerHTML = followerText
                //followingCount.innerHTML = followingText
                followBtn.innerText = followText
            })
            .catch((e)=>{
                console.log(e)
            })
    })



    function reqFollowUnfollow(type,authorId){
        let headers = new Headers()
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type','Application/JSON')

        let req = new Request(`/api/${type}/${authorId}`,{
            method: "GET",
            headers,
            mode: 'cors'
        })

        return fetch(req)
    }


    //comment start
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')

    comment.addEventListener('keypress',function(e){
        if(e.key === 'Enter'){
            if(e.target.value){
                let postId = comment.dataset.post
                let data = {
                    body : e.target.value
                }
                let req = generateRequest(`/api/comments/${postId}`,'POST',data)
                fetch(req)
                    .then(res => res.json())
                    .then(data =>{
                        let commentElement = createComment(data)
                        commentHolder.insertBefore(commentElement,commentHolder.children[0])
                        e.target.value = ""
                    })
                    .catch(e=>{
                        console.log(e.message)
                    })
            }else{
                alert('Please enter value')
            }
        }
    })


    
    commentHolder.addEventListener('keypress',function(e){
        
        if(commentHolder.hasChildNodes(e.target)){
            if(e.key === 'Enter'){
                let commentId = e.target.dataset.comment
                let value = e.target.value

                if(value){
                    let data = {
                        body: e.target.value
                    }
                    let req = generateRequest(`/api/comments/replies/${commentId}`,'POST',data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data =>{
                            let replyElement = createReplyElement(data)
                            let parent = e.target.parentElement
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = ''
                        })
                        .catch(e=>{
                            console.log(e.message)
                        })
                }else{
                    alert("please enter a valid reply")
                }
            }
        }
    })
    //comment end
}

//comment handler stuff
function generateRequest(url,method,body){
    let headers = new Headers()
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type','Application/JSON')

        let req = new Request(url,{
            method,
            headers,
            body: JSON.stringify(body),
            mode: 'cors'
        })

        return req
}

function createComment(comment){
    let innerHTML = `
    <div class="comments-container" style="margin-left: 10px;">
    <ul id="comments-list" class="comments-list" style="padding-left: 0;">
     <li>
     <div class="comment-main-level full-comment-container">
    <div class="comment-avatar"><img src="${ comment.user.profilePics}" alt="">
                                    </div>
    <div class="comment-box">
        <div class="comment-head">
            <h6 class="comment-name by-author"><a
                    href="/author/${comment.user._id}">${comment.user.username}</a>
            </h6>
            <span class="text-dark"> a few seconds ago </span>

        </div>
        <div class="comment-content">
            ${comment.body }
        </div>
    </div>
    </div>
    </div>
    </li>
    </ul>
    </div>

    `

    let div  = document.createElement('div')
    div.className = 'media border'
    div.innerHTML = innerHTML

    return div

}

function createReplyElement(reply){

    let innerHTML = `
    <li>
    <div class="comment-avatar"><img src="${ reply.profilePics }" alt="">
    </div>
    <!-- reply -->
    <div class="comment-box">
        <div class="comment-head">
            <h6 class="comment-name"><a
                    href="/author/${reply.user._id}">${reply.username}</a>
            </h6>
            <span> a few seconds ago </span>
        </div>
        <div class="comment-content">
            ${ reply.body }
        </div>
    </div>
    </li>
    `


    
    replyDivArray[replyDivIndex].innerHTML = innerHTML

    

    // let div  = document.createElement('div')
    // div.innerHTML = innerHTML

    // return div
}