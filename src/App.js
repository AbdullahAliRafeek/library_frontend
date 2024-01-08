import './styles/index.css'
import {useState, useRef, useEffect, useCallback} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
const book = 'PAID EBOOK IG MONEY - @dzmoney22'

function App(props) {
  const domain = props.domain
  const navigate = useRef(useNavigate())
  const states = useRef(useLocation().state)
  const pageNum = useRef(null)
  const [pageSrc, setpageSrc] = useState(null)
  const fetching = useRef(true)
  const maxPageCount = useRef(64)  
  const pageUpTag = useRef([...Array(maxPageCount.current).keys()].map(i => (
    <button key={i+1} onClick={event=>{
      const page = event.currentTarget.innerText
      if (fetching.current && pageNum.current !== page){
        fetching.current = false
        fetchPage(page).then(value =>{
          if (value) pageNum.current = parseInt(page);
          fetching.current = true
        })
      }
    }}> {i+1} </button>
  )))

  //async function that request the page from the server
  const fetchPage = useCallback(async(p)=>{
    //make sure the page isnt outside the book range
    if (p <= maxPageCount.current){
      //try{
      const serverResponse = await fetch(domain+"/api/books/", {
        method:'GET',
        mode:'cors',
        credentials:'include',
        headers:({
          page:p,
          book:book
        }),
      })
      //console.log(serverResponse)
      if (serverResponse.ok){
        const img = await serverResponse.blob()
        setpageSrc(URL.createObjectURL(img))
    
        return 1
      }
      else if (serverResponse.status === 401){
        navigate.current('/')
        return 0
      }  
      //}
      //catch(err) {console.log(err)}
    }
  }, [domain])

  //chcek if the person has logged in and fetch the initial page
  useEffect(()=>{
      if (states.current){ 
        pageNum.current = states.current.page
        fetchPage(pageNum.current)
      }
      //back to the login page if PageSrc == null
      else navigate.current('/');
    }, [fetchPage])

  //fetch the new page and update the page number
  function btnFun(i){
    //fetching refrence to stop DDoS-ing ourselves 
    if (!fetching.current) return false

    //send the request and update the page number on recive
    if (pageNum.current+i > 0){
      fetching.current = false
      fetchPage(pageNum.current + i).then(value =>{
        if (value) pageNum.current = pageNum.current + i;
        fetching.current = true
      })
    }
  }

  //logout and delete the auth cookie
  async function logOut(){
    try{
      const serverResponse = await fetch(domain+"/api/users/logout", {
      method:'GET',
      mode:'cors',
      credentials: "include",
    })
    ///get json response///
    if (serverResponse.ok){ 
     pageNum.current = undefined
     setpageSrc(null) 
     navigate.current('/')
    }
    }
  
    catch(err){
      console.log(err)
      return false}
  }

  return (
    <div id='root'>
      {pageNum.current 
        &&
          <div id='page-container'>
            <img className='pages' id='pageTag' src={pageSrc} alt=''/>

            <div className='footer'>
              <button className='btn' onClick={()=>btnFun(-1)}>Prev</button>
              <div  id='page-picker' onClick={()=>{}}>
                Page {pageNum.current}
                <div className='dropup'>
                    <div className='dropup-contnet' id='pageContent' >
                      <button className='btn' onClick={logOut}>logout</button>
                      {pageUpTag.current && pageUpTag.current}
                    </div>
                </div>
                </div>
              <button className='btn' onClick={()=>btnFun(1)}>Next</button>
              
            </div>
          </div>
        }

 
    </div> 
  );
}

export default App;