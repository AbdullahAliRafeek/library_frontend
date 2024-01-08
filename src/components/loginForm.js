import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'


const LoginForm = (props)=>{
    const domain = props.domain
    const [formData, setformData] = useState({femail:'', fpassword:''});
    const navigate = useNavigate()
    //console.log(navigator.userAgent);
    //console.log(Navigator.gpu)

    //send an auto empty GET request to check for login cookies
    useEffect(()=>{
      console.log(localStorage.getItem('browserToken'))
      try{
        fetch(domain+"/api/users/autoLogin", {
        method:'GET',
        mode:'cors',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'BrowserToken': localStorage.getItem('browserToken')
          }
        }).then(response=>{
          if (response.ok){
            response.json().then(value=>{
              console.log(value)
              //save the tokens and page number
              localStorage.setItem('browserToken', value.browserToken)
              console.log(localStorage.getItem('browserToken'))
              navigate('/'+value.path, { state: { page: value.page} })
              return 1
            })
          } 
          else console.log('User not logged in');
        })
        
      }
      catch(err){
        console.log(err)
      }
    }, [])

    function handleChange(e){
        setformData(prevformData=>{
          return {
            ...prevformData,
            [e.target.id]: e.target.value
          }
        });
      }
      
    function LoginForm(e){
        const feilds = document.getElementById('login-feildset') 
        e.preventDefault();
        const data = formData.femail
        const password = formData.fpassword


        if (data && password) {
          feilds.disabled = true 
          loginFetch(data, password).then(value=>{
              if (value){
                //save the page number
                localStorage.setItem('browserToken', value.browserToken)
                navigate('/'+value.path, { state: {
                  page: value.page
                  } 
                })
              }
              else{
                feilds.disabled = false 
                alert('Wrong username or password')
              }
          })
        }
        //else alert('please fill all data entries');
    
    }

    async function loginFetch(femail, fpassword){
        try{
          const serverResponse = await fetch(domain+"/api/users/login", {
          method:'POST',
          mode:'cors',
          credentials: "include",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'BrowserToken': localStorage.getItem('browserToken')
            },
            body: JSON.stringify({
              name:femail,
              password:fpassword,
          })
        })
        ///get json response///
        if (serverResponse.ok){ 
          const finalResponse = await serverResponse.json()
          return finalResponse
        }
        return false
        }
      
        catch(err){
          alert(err)
          return false}
      }

    return( 
    <div className="container" onSubmit={LoginForm} id='loginForm'>
        <div className="top"></div>
          <div className="bottom"></div>
          <div className="center">
            <form >
              <fieldset id='login-feildset'>
                <h2>Please Sign In</h2>
                  <input type="email" placeholder="Name or phone number" id="femail"  value={formData.femail} onChange={handleChange}/>
                  <input type="password" placeholder="password" id="fpassword"  value={formData.fpassword} onChange={handleChange}/>

                  <div id='loginButtons'>
                    <button type='submit' onClick={LoginForm}><b>Login</b></button>
                    <button type="button"><b>Sign in</b></button>
                  </div>
              </fieldset>
            </form>
        </div>
    </div>
    )
}

export default LoginForm

/*

*/