//comment start
const commentHolder = document.getElementById('comment-holder')

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
                href="http://creaticode.com/blog">${comment.user.username}</a>
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
                href="http://creaticode.com/blog">${reply.username}</a>
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