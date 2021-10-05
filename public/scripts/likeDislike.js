
window.onload = function(){
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
}