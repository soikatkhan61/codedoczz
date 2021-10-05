window.onload = function(){
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
                let followerText = data.totalFollwer 
                //let followingText = `${data.totalfollowing}`
                let followText = data.followed ? 'Followed' : 'Follow'

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
}