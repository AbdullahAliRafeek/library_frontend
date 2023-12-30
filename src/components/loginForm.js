import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'


const LoginForm = (props)=>{
    const domain = props.domain
    const [formData, setformData] = useState({femail:'', fpassword:''});
    const navigate = useNavigate()
    
    //send an auto empty GET request to check for login cookies
    useEffect(()=>{
      try{
        fetch(domain+"/api/users/autoLogin", {
        method:'GET',
        mode:'cors',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(response=>{
          console.log(response)
          if (response.ok){
            response.json().then(value=>{
              //save the token and page number
              navigate('/user', { state: { page: value.page } })
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
        e.preventDefault();
        const data = formData.femail
        const password = formData.fpassword
    
        if (data && password) {
        loginFetch(data, password).then(value=>{
            if (value){
              console.log(value)
            //save the token and page number
            navigate('/user', { state: { page: value.page } })
            }
        })
        }
        else alert('please fill all data entries');

    
    }

    async function loginFetch(femail, fpassword){
        try{
          const serverResponse = await fetch(domain+"/api/users/login", {
          method:'POST',
          mode:'cors',
          credentials: "include",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email:femail,
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
          console.log(err)
          return false}
      }

    return(
    <form className="container" onSubmit={LoginForm} id='loginForm'>
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="center">
            <h2>Please Sign In</h2>
            <input type="email" placeholder="email" id="femail"  value={formData.femail} onChange={handleChange}/>
            <input type="password" placeholder="password" id="fpassword"  value={formData.fpassword} onChange={handleChange}/>

            <div id='loginButtons'>
              <button type='submit' onClick={LoginForm}><b>Login</b></button>
              <button type="button"><b>Sign in</b></button>
            </div>

        </div>
    </form>
    )
}

export default LoginForm

/*

*/