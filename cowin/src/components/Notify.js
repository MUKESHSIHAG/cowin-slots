import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import firebase from './Firestore'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/notify.css';

function Notify(props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pincode, setPincode] = useState('')

    const addUser = (e) => {
        e.preventDefault();
        const db = firebase.firestore();
        const userRef = db.collection('users').add({
          name,
          email,
          pincode
        });
        toast.success("Adde successfully to our database", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })
        setName('');
        setEmail('');
        setPincode('');
    };

    return (
        <div>
            <ToastContainer />            
            <div style={{backgroundColor:"#f2f4f7"}}>
                <Link to='/home' style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>Home</span></Link>
                <Link to='/notify'style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>notifier</span></Link>
            </div>
            <form className='notify-form'>
                <h1>Subscribe Us</h1>
                <fieldset>
                    <label className='notify-label' for="name">Name</label>
                    <input className='notify-input' type="text" value={name} onChange={(e)=>setName(e.target.value)} />

                    <label className='notify-label' for="mail">Email</label>
                    <input className='notify-input' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

                    <label className='notify-label' for="password">Pincode</label>
                    <input className='notify-input' type="pincode" value={pincode} onChange={(e)=>setPincode(e.target.value)} />
                </fieldset>

                <button type="submit" onClick={addUser}>Submit</button>
            </form>
        </div>
    );
}

export default Notify;