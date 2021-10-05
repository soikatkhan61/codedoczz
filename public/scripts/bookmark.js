window.onload = function(){
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
                        console.log("hello")
                        target.innerHTML = ' <i class="fas fa-bookmark"></i>'
                    }else{
                        console.log("solid")
                        target.innerHTML = ' <i class="far fa-bookmark"></i>'
                    }
                })
                .catch(e=>{
                    console.error(e.response.data)
                    alert(e.response.data.error)
                })

        })
    })
}