//react CORE
import React from 'react'
import { useEffect, useRef, useState, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
//coustom cpmpopents
import UsersList from './UsersList'

//SVG files
import { ReactComponent as VectorAddUser } from '../images/add-user-svgrepo-com.svg'
import { ReactComponent as VectorCheckMark } from '../images/check mark.svg'
import { ReactComponent as VectorCrossMark } from '../images/cross mark.svg'

function disableChildren(mother){
    for (let i=0; i<mother.length; i++){
        mother[i].disabled = true;
    }
}

function enableChildren(mother){
    for (let i=0; i<mother.length; i++){
        mother[i].disabled = false;
    }
}




const AdminPanel = (props) => {
    const navigator = useNavigate()
    const domain = props.domain
    const userSign = useRef('OR')
    const newUsersListTag = useRef()
    const [users, setUsers] = useState()
    const [restart, setRestart] = useState(0)
    console.log(restart)

    //fetch the data of the users
    const updateCurrentUsers = useCallback(async ()=>{
        //fetch all new users (add catagories)
        try{
            const res = await fetch(domain+"/api/admin/users", {
                method:'GET',
                mode:'cors',
                credentials: "include", 
              })
              if (resMiddleware(res.status)){
                const users = await res.json()               
                setUsers(users)  
                }
        }
        catch(err){
            console.log(err)
        }
        
    }, [domain])

    useEffect(()=>{
        updateCurrentUsers()
    },[updateCurrentUsers]) 

    function addUserPopup(){
        if (!newUsersListTag.current){
            const usersPopup = document.getElementById('add_users_popup')
            if (!usersPopup.style.display || usersPopup.style.display==='none'){
                usersPopup.style.display = 'flex'
                return 1
            }
            usersPopup.style.display = 'none'
            return 0
        }
        newUsersListTag.current = null
        setRestart(prev=>{return prev+1})

    }

    async function fetchNewUsers(count){
        //get all the request options and disbale them
        const optionsTag = document.getElementById('add_users_popup')
        optionsTag.children[0].children[0].disabled = true
        const btns = optionsTag.children[1].children
        for (let i=0; i<btns.length; i++){
            btns[i].disabled = true;
        }
        try{
            const res = await fetch(domain+"/api/admin//create-user-template", {
                method:'POST',
                mode:'cors',
                credentials: "include", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    count:count,
                    adminID:userSign.current
                    })
                })
            
            //update the display depending on the recived data
            if (resMiddleware(res.status)){
                const {names, passwords} = await res.json()
                newUsersListTag.current = ([...Array(names.length).keys()]).map(i => {
                    return (
                    <form className='row' key={i} onSubmit={()=>{console.log(1)}}>
                        <div>{i}- <input defaultValue={names[i]}/></div>
                        <input defaultValue={passwords[i]}/>
                        <input/>
                        <button type='button' className='check-btn' onClick={()=>{fetchCreateUser(i)}}>
                            <VectorCheckMark style={{width:'100%', height:'100%'}}/>
                        </button>
                    </form>)
                });
                document.getElementById('add_users_popup').style.display = ''
                setRestart(prev=>{return prev + 1})
                //setUserCreationSet({names:names, passwords:passwords})
                //create the tag to update the layout

            }
        }
        catch{}
        //return the buttons back to active
        optionsTag.children[0].children[0].disabled = false
        for (let i=0; i<btns.length; i++){
            btns[i].disabled = false;
        }
        
    }

    async function fetchCreateUser(i){
        const popupTag = document.getElementById('user_confirmation_popup')
        const motherTag = popupTag.children[i+1]
        const userName = motherTag.children[0].children[0].value
        const userPass = motherTag.children[1].value
        const phoneNumber = motherTag.children[2].value
        
        //check if the phone number is correct
        const phoneNumberRegex = /^(077|075)\d{8}$/;
        if (phoneNumberRegex.test(phoneNumber) || 1){
            disableChildren(motherTag)
            //await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await fetch(domain+"/api/admin/create-user", {
                method:'POST',
                mode:'cors',
                credentials: "include", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    name:userName,
                    password:userPass,
                    phoneNumber:phoneNumber
                    })
            })

            if (resMiddleware(res.status)){
                //update to show the new user
                updateCurrentUsers();

                //check if all elements are disabled (end popup lifetime)
                motherTag.ok = true //aka the row is done is and dead
                const length = popupTag.children.length
                let e
                for (e=1; e<length; e++){
                    if (!popupTag.children[e].ok)break;
                }
                if(e === length){
                    addUserPopup()
                }
            }
            else{
                enableChildren(motherTag)
                alert(await res.json())
            }
            
        }    
        else alert('The phone number at name ' + i + ' is incorrect');
    }   

    async function fetchDeleteUser(name){
        if (window.confirm('Are you sure you want to delete user' + name)){
            const res = await fetch(domain+"/api/admin/delete-user", {
                method:'POST',
                mode:'cors',
                credentials: "include", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    name:name
                    })
            })
            if (resMiddleware(res.status))updateCurrentUsers();
        }
    }

    function resMiddleware(status){
        status = status + ''

        //Continue with the succussful response
        if (status.startsWith(2)) return true;

        //logout since token has expired
        else if (status === '401') {
            alert('Expired token');
            navigator('/');
        }
        //invalid creditionals
        else if (status === '400') console.log(3);
        return false
    }

    //logout and delete the auth cookie
    async function logOut(){
    try{
      const res = await fetch(domain+"/api/users/logout", {
      method:'GET',
      mode:'cors',
      credentials: "include",
    })
    ///get json response///
    if (res.ok){ 
        navigator('/')
    }
    }
    catch(err){
      console.log(err)
      return false}
  }


  return (
    <div id='panel-container'>
        <div id='admin_panel'>
            <h1>Admin panel</h1>
            <div id='specs'>
                <button className='spec'>Number of Users: {users ? users.length : 'N/A'}</button>
                <button className='spec'>Today's Log-ins</button>
                <button className='spec' onClick={logOut}>N/A</button>
            </div>

            <div id='users-info'>
                <div id='user-query'>
                    <button>All</button>
                    <button>Unassigned</button>
                    <button>Recent</button>
                </div>               
                
                <div className='user-info'>
                    <b>Name</b>
                    <b>Number</b>
                    <b>Page</b>
                    <b>Last seen</b>
                    <button id='add_btn' onClick={addUserPopup}><VectorAddUser style={{width:'100%', height:'100%'}}/></button>
                </div>

                <UsersList users={users} fetchDeleteUser={fetchDeleteUser}/>
            </div>
        </div>

        <div id='add_users_popup'>
            <form onSubmit={(e)=>{
                e.preventDefault();
                const input = e.target.elements[0]
                fetchNewUsers(input.value)
                input.value = null
                }}>
                <input type='number' placeholder='Number of new users "1-15"' min='1' max='15'/>
            </form>

            <div className='quick_select_buttons'>
                <button className='hover_lm' onClick={()=>{fetchNewUsers(1)}}><b>1</b></button>
                <button className='hover_lm' onClick={()=>{fetchNewUsers(5)}}><b>5</b></button>
                <button className='hover_lm' onClick={()=>{fetchNewUsers(10)}}><b>10</b></button>
            </div>
        </div>

        {newUsersListTag.current && 
            <div id='user_confirmation_popup'>
                <div className='row'>
                    <div>Name</div>
                    <div>Password</div>
                    <div>Phone number</div>
                    <button className='cross-btn' onClick={addUserPopup}><VectorCrossMark style={{width:'100%', height:'100%'}}/></button>
                </div>
                {newUsersListTag.current}
            </div>
        }

    </div>
  )
}

export default AdminPanel
