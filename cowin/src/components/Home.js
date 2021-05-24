import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Switch from "react-switch";
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
    const [isToggel, setIsToggel] = useState(false);
    const [msg, setMsg] = useState('');

    // Fetching the state and districts initially, states and districts are an empty array, so 
    // Fetched the state and district to show the list in dropdown
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

    // This function fetches the slot information available on the selected date     
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

            // datepicker return the date in format: 2021-05-25
            // But API accepts date as: 25-05-2021
            // So, to convert it to required format data slicing has been done
            let dateFormat = '';
            dateFormat = date.slice(8) + '-' + date.slice(5,7) + '-' + date.slice(0,4);

            // Fetching slots information by Pincode as entered in Input box
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

            // fetching the slots information of district selected by user
            else {
                // console.log("did", districtId);
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

    // This function set the state selected by user in dropdown
    // After setting the state, districts of that state also needed to fetch
    // That's why fetchDistrictOfState function is called with a state_id(id of the current selected state)
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
        console.log(districts);
        districts.map((item) => {
            if(item.district_name===e.target.value) {
                setDistrictId(item.district_id);
            }
        })
    }

    // Fetching the districts of selected state
    const fetchDistrictOfState = (id) => {
        axios.get(`${url}/v2/admin/location/districts/${id}`)
        .then(res => {
            setDistricts(res.data.districts)

            // setDistrictId is set if user only selected state and clicks on submit button
            // Than districtId is set to the first district id of that state and slots info
            // Can be fetched, if this couldn't be done, than if user doesn't select district 
            // api will fetch nothing, because there wouldn't be any districtID provided    
            setDistrictId(res.data.districts[0].district_id)
        })
        .catch(err => {
            console.log(err, "error in fetching districts");
        })
    }

    // This function simple toggels, either user wants to fetch slot details by pincode or district
    // setPincode is set because, in fetchSlot function I have checked, if pincode is entered than, 
    // data is fetched by pincode, so if user toggels to district and if some pincode is entered before
    // toggeling, then, slot detail will be fetched by pincode, that's why pincode is set empty after toggeling
    const handleToggel = () => {
        setPincode('')
        setIsToggel(!isToggel)
    }

    // This function simply handles date
    // if user tries to enter an incorrect date like (29-02-2021)
    // So, datepicker itself doesn't allow to write incorrect date and
    // set date field to empty. So Here I have checked if date is empty than
    // it is an invalid date, which isn't allowed. So a message will be shown
    // to alert user
    const handleDate = (e) => {
        e.preventDefault();
        let date = e.target.value
        // if date is valid than console.log will log, that data, i.e. 2021-05-25
        // and if it is an invalid date, than console.log will log nothing or is empty
        // that's why I have done this if date===''
        console.log(date);      
        if(date==='') {
            setMsg("Can't enter Invalid Date")
        }
        else {
            setMsg('')
            setDate(e.target.value)
        }
    }

    return (
        <div>
            <ToastContainer />
            <div style={{backgroundColor:"#f2f4f7"}}>
                <Link to='/home' style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>Home</span></Link>
                <Link to='/notify'style={{textDecoration:"none", color:"#0455cf", fontSize:"30px", marginLeft:"20px"}}><span>notifier</span></Link>
            </div>
            <div style={{marginLeft:"2%", marginTop:"5%"}}>
                <label style={{fontSize:"150%", marginRight:"2%", fontWeight:"600"}}>Fetch By District</label>
                <Switch onChange={handleToggel} checked={isToggel} />
            </div>
            <form style={{marginTop:"5%", paddingBottom:"15%"}}>
                {!isToggel ? 
                    <div className="form-group col-md-6" >
                        <label htmlFor="pincode">Pincode</label>
                        <input onChange={(e) => {setPincode(e.target.value)}} value={pincode} type="text" className="form-control" placeholder="Enter Pincode" />
                    </div> 
                    :
                    <>
                    <div className="form-group col-md-6" >
                        <label htmlFor="state">State</label>
                        <select class="form-control" id="states" onChange={handleState} value={state}>
                        {states && states.map((item, key) => 
                            <option key={key} id={item.state_id}>{item.state_name}</option>
                        )}
                        </select>
                    </div>
                    <div className="form-group col-md-6" >
                        <label htmlFor="district">District</label>
                        <select class="form-control" onChange={handleDistrict} value={district}>
                        {districts && districts.map((item, key) => 
                            <option key={key} id={item.district_id}>{item.district_name}</option>
                        )}
                        </select>
                    </div>
                    </>
                    }
                <div className="form-group col-md-6" >
                    <label htmlFor="date-input">Date</label>
                    <input className="form-control" onChange={handleDate} type="date" value={date} />                    
                    <span style={{color:"red"}}>{msg}</span>
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
            
            <table class="table" id="dataTable" style={{marginTop: "50px", marginLeft:"0px"}}>
                <thead style={{marginLeft:"5%"}}>
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