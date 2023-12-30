import React from 'react'
import { useEffect, useRef, useState, useCallback} from 'react'
import { ReactComponent as VectorAddUser } from '../images/add-user-svgrepo-com.svg'
import { ReactComponent as VectorRemoveUser } from '../images/remove-user-svgrepo-com.svg'

const AdminPanel = (props) => {
    const domain = props.domain
    const usersTag = useRef(null)
    const [users, setUsers] = useState(1)

    const fetchAllUsers = useCallback(async ()=>{
        try{
            const serverResponse = await fetch(domain+"/api/admin/users", {
                method:'GET',
                mode:'cors',
                credentials: "include", 
              })
              if (serverResponse.ok){
                const users = await serverResponse.json()
                return users  
              }
        }
        catch(err){
            console.log(err)
        }
    }, [])

    useEffect(()=>{
        fetchAllUsers().then(users=>{
            if (users){
                usersTag.current = [...Array(users.length).keys()].map(i=>(
                    <div key={i} className='user-info'>
                        <div>{users[i].name}</div>
                        <div>{users[i].name}</div>
                        <div>{users[i].name}</div> 
                        <div>{users[i].name}</div>
                        <button className='remove_btn'><VectorRemoveUser style={{width:'100%', height:'100%'}}/></button>
                    </div>  
                ))
            }
            setUsers(users) 
        })
    },[fetchAllUsers]) 




  return (
    <div id='panel-container'>
        <div id='admin_panel'>
            <h1>Admin panel</h1>
            <div id='specs'>
                <div className='spec'>12</div>
                <div className='spec'>12</div>
                <div className='spec'>123</div>
            </div>

            <div id='users-info'>
                <div className='user-info'>
                    <b>Name</b>
                    <b>Device</b>
                    <b>Page</b>
                    <b>Last seen</b>
                    <button id='add_btn'><VectorAddUser style={{width:'100%', height:'100%'}}/></button>
                </div>
                {usersTag.current}
            </div>
        </div>
    </div>
  )
}

export default AdminPanel