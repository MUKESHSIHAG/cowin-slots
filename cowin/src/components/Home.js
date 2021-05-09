import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home(props) {
    const url = 'https://cdn-api.co-vin.in/api'

    const [pincode, setPincode] = useState('');
    const [districtId, setDistrictId] = useState();
    const [states, setStates] = useState([]);
    const [state, setState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [district, setDistrict] = useState('');
    const [date, setDate] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get(`${url}/v2/admin/location/states`,{})
        .then(res => {
            console.log(res.data.states);
            setStates(res.data.states);
        })
        .catch(err => {
            console.log(err, "error");
        })
        fetchDistrictOfState(1)
    }, [])

    const fetchSlots = (e) => {
        e.preventDefault();
        console.log(pincode, date);
        if(!date.length) 
        toast.warning("Please select date",{
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })
        else{            
            setIsLoading(true)
            let dateFormat = '';
            dateFormat = date.slice(8) + '-' + date.slice(5,7) + '-' + date.slice(0,4);
            if(pincode.length>0) {
                axios.get(`${url}/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${dateFormat}`,{})
                .then(res => {
                    console.log(res.data.sessions);
                    setData(res.data.sessions);
                    setIsLoading(false)
                })
                .catch(err => {
                    
                    // err.request.response is a string like this {"errorCode":"APPOIN0018","error":"Invalid Pincode"}
                    // So to get the error message, first I have converted it into object using JSON.parse and then
                    // get the error message

                    toast.error(JSON.parse(err.request.response).error, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                    console.log(JSON.parse(err.request.response));
                    setIsLoading(false)
                })        
            }
            else {
                console.log("did", districtId);
                axios.get(`${url}/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${dateFormat}`,{})
                .then(res => {
                    setData(res.data.sessions);
                    setIsLoading(false)
                })
                .catch(err => {
                    console.log(err, "error");
                    setIsLoading(false)
                })
            }
        }
    }

    const handleState = (e) => {
        e.preventDefault();
        setState(e.target.value)
        let state_id=1;
        states.map((item) => {
            if(item.state_name===e.target.value) {
                state_id=item.state_id
            }
        })
        // console.log(e.target.value, state_id);
        fetchDistrictOfState(state_id);
    }

    const handleDistrict = (e) => {
        e.preventDefault();
        setDistrict(e.target.value)
        districts.map((item) => {
            if(item.district_name===e.target.value) {
                setDistrictId(item.district_id);
            }
        })
    }

    const fetchDistrictOfState = (id) => {
        axios.get(`${url}/v2/admin/location/districts/${id}`)
        .then(res => {
            setDistricts(res.data.districts)
            setDistrictId(res.data.districts[0].district_id)
        })
        .catch(err => {
            console.log(err, "error in fetching districts");
        })
    }

    return (
        <div>
            <ToastContainer />
            <div style={{backgroundColor:"#f2f4f7"}}>
                <Link to='/home' style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>Home</span></Link>
                <Link to='/notify'style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>notifier</span></Link>
            </div>
            <form style={{marginTop:"5%", paddingBottom:"15%"}}>
                <div className="form-group col-md-6" >
                    <label htmlFor="pincode">Pincode</label>
                    <input onChange={(e) => {setPincode(e.target.value)}} value={pincode} type="text" className="form-control" placeholder="Enter Pincode" />
                </div>                
                <div className="form-group col-md-3" >
                    <label htmlFor="state">State</label>
                    <select class="form-control" id="states" onChange={handleState} value={state}>
                    {states && states.map((item, key) => 
                        <option key={key} id={item.state_id}>{item.state_name}</option>
                    )}
                    </select>
                </div>
                <div className="form-group col-md-3" >
                    <label htmlFor="district">District</label>
                    <select class="form-control" onChange={handleDistrict} value={district}>
                    {districts && districts.map((item, key) => 
                        <option key={key} id={item.district_id}>{item.district_name}</option>
                    )}
                    </select>
                </div>
                <div className="form-group col-md-6" >
                    <label htmlFor="date-input">Date</label>
                    <input className="form-control" onChange={(e) => {setDate(e.target.value)}} type="date" value={date} />                    
                </div>
                <center>
                <div className="form-group row col-md-12" >
                    {!isLoading ? 
                    <button type="submit" onClick={fetchSlots} className="btn" style={{width:"10%",marginTop:"2%", backgroundColor:"#038cfc", color:"white"}}>
                        submit
                    </button>
                    :
                    <button type="submit"  disabled className="btn" style={{width:"10%",marginTop:"2%", backgroundColor:"#038cfc", color:"white"}}>
                        Fetching...
                    </button>
                    
                    }
                </div>
                </center>
            </form>
            
            <table class="table" id="dataTable" style={{marginTop: "50px"}}>
                <thead>
                    <tr>
                    <th scope="col">Center Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">District</th>
                    <th scope="col">Block Name</th>
                    <th scope="col">Pincode</th>
                    <th scope="col">From</th>
                    <th scope="col">Available Slots</th>
                    </tr>
                </thead>
                {data.length==0 ? 
                <tbody>
                    <center><h4>No Data Available</h4></center>
                </tbody>
                :
                <tbody>
                    {data.length>0 && data.map((item, key) => 
                        <tr key={key}>
                        <th scope="row">{item.name}</th>
                            <td>{item.address}</td>
                            <td>{item.district_name}</td>
                            <td>{item.block_name}</td>
                            <td>{item.pincode}</td>
                            <td>{item.from}</td>
                            {item.slots.map((name, key) =>
                            <tr>
                                {key%2===0 ? 
                                <td style={{backgroundColor:"white"}} key={key}>{name}</td>
                                :
                                <td style={{backgroundColor:"#e9ecf2"}} key={key}>{name}</td>
                                }
                            </tr>
                            )}
                        </tr>
                    )} 
                </tbody>
                }                  
            </table>
        </div>
    );
}

export default Home;