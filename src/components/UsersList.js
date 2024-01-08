import React from 'react'
import { ReactComponent as VectorRemoveUser } from '../images/remove-user-svgrepo-com.svg'

const UsersList = (props)=>{
    const users = props.users;
    const fetchDeleteUser = props.fetchDeleteUser;
    if (users)
    return(
        [...Array(users.length).keys()].map(i=>(
            <div key={i} className='user-info'>
                <div>{users[i].name}</div>
                <div>{users[i].phone}</div>
                {users[i].page ? <div>{users[i].page}</div> : <div>N/A</div>} 
                {users[i].lastSeen ? <div>{users[i].page}</div> : <div>N/A</div>} 
                <button className='remove_btn' onClick={()=>{fetchDeleteUser(users[i].name)}}><VectorRemoveUser style={{width:'100%', height:'100%'}}/></button>
            </div>  
       )) 
    );

    return (<div>loading</div>)
}

export default UsersList
